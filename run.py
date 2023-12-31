"""
文件名: run.py
作者: MarkCup
版本: 0.1
创建日期: 2023-12-25
最后修改日期: 2023-12-25
描述: 主程序入点,开启flask后端服务
"""

from app import create_app

app = create_app()

if __name__ == '__main__':
    
    #运行实例
    app.run(debug=True,host="0.0.0.0")
