from flask import render_template, send_file
from . import eng_bp
from gtts import gTTS
import os
import pandas as pd
import numpy as np

# 主页路由
@eng_bp.route('/englishword/word/<word>')
def index(word):
    return render_template('english/index.html',word=word,translation="ceshi")


@eng_bp.route('/englishword/audio/<text>')
def tts(text):
    if not os.path.exists('app/temp_engoutput'):
        os.makedirs('app/temp_engoutput')
    file_name = "".join(c if c.isalnum() or c in ['-', '_'] else '_' for c in text)
    mp3_file_path = f"app/temp_engoutput/{file_name}.mp3"
    if not os.path.exists(mp3_file_path):
        # 如果文件不存在，则生成语音文件
        tts = gTTS(text, lang='en')
        tts.save(mp3_file_path)
    # 返回语音文件
    return send_file(f"temp_engoutput/{file_name}.mp3", as_attachment=True)

# 指定Excel文件路径
excel_file_path = 'active.xlsx'

# 使用pandas读取Excel文件
df = pd.read_excel(excel_file_path)

# 打乱
df = df.sample(frac=1).reset_index(drop=True)

i=0

@eng_bp.route("/englishword/next")
def next():
    global i,df
    if i>=len(df):
        e="没了"
        c="nothing"
        df = df.sample(frac=1).reset_index(drop=True)
        i=0
    else:
        e=df.at[i, '英文']
        c=df.at[i, '中文']
        i+=1
    return render_template('english/index.html',word=e,translation=c)

