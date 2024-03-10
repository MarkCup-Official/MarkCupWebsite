import pandas as pd

def next():
    # 指定Excel文件路径
    excel_file_path = 'active.xlsx'

    # 使用pandas读取Excel文件
    df = pd.read_excel(excel_file_path)

    # 打印数据框的前几行
    print(df)# 指定Excel文件路径

    df['tag'] = 0
    print(df)

next()