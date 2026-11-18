import os
import re
import json
import subprocess
from datetime import datetime

TRANSCRIPT_PATH = '/Users/dhruvvaghasiya/.gemini/antigravity/brain/322c5ab9-49ff-45a0-ac17-637ccf0eedf8/.system_generated/logs/transcript.jsonl'
OUTPUT_HTML = '/Users/dhruvvaghasiya/Desktop/EtEndsem/docs/ET617_23B2525_AI_Chat_Transcript.html'
OUTPUT_PDF = '/Users/dhruvvaghasiya/Desktop/EtEndsem/ET617_23B2525_AI_Chat_Transcript.pdf'
DOCS_PDF = '/Users/dhruvvaghasiya/Desktop/EtEndsem/docs/ET617_23B2525_AI_Chat_Transcript.pdf'

def clean_user_text(raw: str) -> str:
    # Extract text within <USER_REQUEST>...</USER_REQUEST>
    match = re.search(r'<USER_REQUEST>(.*?)</USER_REQUEST>', raw, re.DOTALL)
    if match:
        text = match.group(1).strip()
    else:
        text = re.sub(r'<ADDITIONAL_METADATA>.*?</ADDITIONAL_METADATA>', '', raw, flags=re.DOTALL).strip()
    return text

def md_to_html(text: str) -> str:
    import html
    # Escape HTML characters first
    escaped = html.escape(text)

    # Convert code blocks ```...```
    def code_block_repl(match):
        code = match.group(2)
        lang = match.group(1) or ''
        return f'<pre class="code-block"><code class="{lang}">{code}</code></pre>'
    escaped = re.sub(r'```(\w+)?\n?(.*?)```', code_block_repl, escaped, flags=re.DOTALL)

    # Convert inline code `...`
    escaped = re.sub(r'`([^`]+)`', r'<code class="inline-code">\1</code>', escaped)

    # Convert bold **...**
    escaped = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', escaped)

    # Convert headers
    escaped = re.sub(r'^### (.*?)$', r'<h3>\1</h3>', escaped, flags=re.MULTILINE)
    escaped = re.sub(r'^## (.*?)$', r'<h2>\1</h2>', escaped, flags=re.MULTILINE)
    escaped = re.sub(r'^# (.*?)$', r'<h1>\1</h1>', escaped, flags=re.MULTILINE)

    # Convert list items
    lines = escaped.split('\n')
    in_list = False
    new_lines = []
    for line in lines:
        if line.strip().startswith('- ') or line.strip().startswith('* '):
            if not in_list:
                new_lines.append('<ul>')
                in_list = True
            item_text = line.strip()[2:]
            new_lines.append(f'<li>{item_text}</li>')
        else:
            if in_list:
                new_lines.append('</ul>')
                in_list = False
            new_lines.append(line)
    if in_list:
        new_lines.append('</ul>')

    escaped = '\n'.join(new_lines)

    # Convert tables (simple markdown tables)
    def parse_tables(txt):
        lines = txt.split('\n')
        out = []
        table_lines = []
        for line in lines:
            if '|' in line and line.strip().startswith('|') and line.strip().endswith('|'):
                table_lines.append(line)
            else:
                if table_lines:
                    out.append(render_table(table_lines))
                    table_lines = []
                out.append(line)
        if table_lines:
            out.append(render_table(table_lines))
        return '\n'.join(out)

    def render_table(t_lines):
        if len(t_lines) < 2:
            return '\n'.join(t_lines)
        html_tab = ['<table class="chat-table">']
        # Header
        headers = [c.strip() for c in t_lines[0].strip('|').split('|')]
        html_tab.append('<thead><tr>' + ''.join(f'<th>{h}</th>' for h in headers) + '</tr></thead>')
        html_tab.append('<tbody>')
        for row in t_lines[2:]:
            cells = [c.strip() for c in row.strip('|').split('|')]
            html_tab.append('<tr>' + ''.join(f'<td>{c}</td>' for c in cells) + '</tr>')
        html_tab.append('</tbody></table>')
        return '\n'.join(html_tab)

    escaped = parse_tables(escaped)

    # Paragraphs (convert double newlines)
    paragraphs = escaped.split('\n\n')
    formatted = []
    for p in paragraphs:
        p = p.strip()
        if not p:
            continue
        if p.startswith('<h') or p.startswith('<pre') or p.startswith('<table') or p.startswith('<ul'):
            formatted.append(p)
        else:
            formatted.append(f'<p>{p.replace("\n", "<br/>")}</p>')

    return '\n'.join(formatted)

def main():
    messages = []
    with open(TRANSCRIPT_PATH, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                item = json.loads(line)
                t = item.get('type')
                content = item.get('content', '')
                if not content or content.startswith('<SYSTEM_MESSAGE>'):
                    continue

                if t == 'USER_INPUT':
                    user_text = clean_user_text(content)
                    if user_text:
                        messages.append({
                            'role': 'user',
                            'sender': 'Candidate (Student: 23B2525)',
                            'time': item.get('created_at', ''),
                            'text': user_text
                        })
                elif t == 'PLANNER_RESPONSE':
                    # Only add non-trivial responses
                    if len(content.strip()) > 0:
                        messages.append({
                            'role': 'assistant',
                            'sender': 'AI Assistant (Antigravity)',
                            'time': item.get('created_at', ''),
                            'text': content.strip()
                        })
            except Exception as e:
                pass

    print(f"Extracted {len(messages)} dialog turns.")

    # Generate styled HTML
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ET617 Course Examination — AI Development Chat Transcript (Roll No: 23B2525)</title>
  <style>
    @page {{
      size: A4;
      margin: 16mm 14mm 16mm 14mm;
      @bottom-right {{
        content: counter(page);
      }}
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 13px;
      line-height: 1.5;
      color: #1a1a1a;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }}
    .header-box {{
      border: 2px solid #2E7D32;
      background: #E8F5E9;
      padding: 16px 20px;
      border-radius: 10px;
      margin-bottom: 24px;
    }}
    .header-title {{
      font-size: 20px;
      font-weight: 800;
      color: #1B5E20;
      margin: 0 0 6px 0;
    }}
    .meta-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 20px;
      font-size: 12px;
      color: #333333;
      margin-top: 10px;
    }}
    .meta-item strong {{
      color: #1B5E20;
    }}
    .phase-badge-strip {{
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 10px;
    }}
    .badge {{
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      background: #ffffff;
      border: 1px solid #81C784;
      color: #1B5E20;
    }}
    .turn {{
      margin-bottom: 18px;
      page-break-inside: avoid;
    }}
    .turn-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
      font-size: 11px;
      font-weight: bold;
    }}
    .user-header {{
      color: #1565C0;
    }}
    .assistant-header {{
      color: #2E7D32;
    }}
    .bubble {{
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }}
    .user-bubble {{
      background: #F0F7FF;
      border-color: #BBDEFB;
      border-left: 4px solid #1E88E5;
    }}
    .assistant-bubble {{
      background: #FAFAFA;
      border-color: #E0E0E0;
      border-left: 4px solid #2E7D32;
    }}
    p {{
      margin: 0 0 8px 0;
    }}
    p:last-child {{
      margin-bottom: 0;
    }}
    h1, h2, h3 {{
      color: #1B5E20;
      margin: 12px 0 6px 0;
    }}
    h1 {{ font-size: 16px; }}
    h2 {{ font-size: 15px; }}
    h3 {{ font-size: 14px; }}
    ul {{
      margin: 4px 0 8px 20px;
      padding: 0;
    }}
    li {{
      margin-bottom: 3px;
    }}
    .inline-code {{
      background: #EFEFEF;
      padding: 1px 4px;
      border-radius: 3px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 11px;
      color: #C2185B;
    }}
    .code-block {{
      background: #263238;
      color: #ECEFF1;
      padding: 10px 14px;
      border-radius: 6px;
      overflow-x: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 11px;
      line-height: 1.4;
      margin: 8px 0;
    }}
    .chat-table {{
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 11px;
    }}
    .chat-table th, .chat-table td {{
      border: 1px solid #CFD8DC;
      padding: 5px 8px;
      text-align: left;
    }}
    .chat-table th {{
      background: #ECEFF1;
      font-weight: bold;
    }}
    .chat-table tr:nth-child(even) {{
      background: #F9FBE7;
    }}
    .page-footer {{
      margin-top: 30px;
      padding-top: 12px;
      border-top: 1px solid #E0E0E0;
      font-size: 10px;
      color: #757575;
      text-align: center;
    }}
  </style>
</head>
<body>

  <div class="header-box">
    <div class="header-title">🎓 ET617 Educational Technology — Examination AI Chat Disclosure</div>
    <div class="meta-grid">
      <div class="meta-item"><strong>Student / Roll No:</strong> 23B2525</div>
      <div class="meta-item"><strong>Date:</strong> November 18, 2026</div>
      <div class="meta-item"><strong>Project:</strong> Bubble Lab 🌱 (Photosynthesis Inquiry Lab)</div>
      <div class="meta-item"><strong>Exam Cards:</strong> P5 (Inquiry) · T3 (Photosynthesis) · L7 (Multi-grade) · C5 (Teacher-in-the-loop)</div>
      <div class="meta-item"><strong>Live URL:</strong> <a href="https://et617-23b2525.vercel.app">https://et617-23b2525.vercel.app</a></div>
      <div class="meta-item"><strong>GitHub Repo:</strong> <a href="https://github.com/PrimeDhruv/et617-endsem-23B2525">PrimeDhruv/et617-endsem-23B2525</a></div>
    </div>
    <div class="phase-badge-strip">
      <span class="badge">Phase 1: Scaffold</span>
      <span class="badge">Phase 2: Simulation Model</span>
      <span class="badge">Phase 3: Welcome & Guess</span>
      <span class="badge">Phase 4: Lab Bench SVG</span>
      <span class="badge">Phase 5: Results & Hints</span>
      <span class="badge">Phase 6: 5 Check Tasks</span>
      <span class="badge">Phase 7: Gemini API & Fallback</span>
      <span class="badge">Phase 8: Teacher Dashboard</span>
      <span class="badge">Phase 9: Styling & Polish</span>
      <span class="badge">Phase 10: Documentation</span>
    </div>
  </div>

  <div class="chat-container">
"""

    for i, msg in enumerate(messages):
        is_user = msg['role'] == 'user'
        header_class = 'user-header' if is_user else 'assistant-header'
        bubble_class = 'user-bubble' if is_user else 'assistant-bubble'
        icon = '👤' if is_user else '🤖'
        formatted_body = md_to_html(msg['text'])

        html_content += f"""
    <div class="turn">
      <div class="turn-header {header_class}">
        <span>{icon} {msg['sender']}</span>
        <span>Turn #{i+1}</span>
      </div>
      <div class="bubble {bubble_class}">
        {formatted_body}
      </div>
    </div>
"""

    html_content += """
  </div>

  <div class="page-footer">
    ET617 Course Examination · Roll No: 23B2525 · Official AI Development Trajectory Log · Antigravity AI Assistant
  </div>

</body>
</html>
"""

    with open(OUTPUT_HTML, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"HTML saved to {OUTPUT_HTML} ({os.path.getsize(OUTPUT_HTML)} bytes)")

    # Run Chrome Headless to PDF
    user_dir = '/tmp/chrome-pdf-user-data'
    os.makedirs(user_dir, exist_ok=True)
    chrome_path = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    cmd = [
        chrome_path,
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        f'--user-data-dir={user_dir}',
        '--no-pdf-header-footer',
        f'--print-to-pdf={OUTPUT_PDF}',
        OUTPUT_HTML
    ]

    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0 and os.path.exists(OUTPUT_PDF):
        # Also copy to docs/
        import shutil
        shutil.copyfile(OUTPUT_PDF, DOCS_PDF)
        print(f"PDF successfully generated at {OUTPUT_PDF} ({os.path.getsize(OUTPUT_PDF)} bytes)!")
        print(f"PDF copy saved at {DOCS_PDF}")
    else:
        print(f"Chrome error: {res.returncode}")
        print(res.stderr)

if __name__ == '__main__':
    main()
