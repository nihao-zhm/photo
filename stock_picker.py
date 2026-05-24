import akshare as ak
import pandas as pd
import numpy as np
import json


def calculate_technical_indicators(df):
    N = 9
    M1, M2, M3, M4 = 14, 28, 57, 114

    df = df.copy()

    df['HHV_H_N'] = df['最高'].rolling(window=N).max()
    df['LLV_L_N'] = df['最低'].rolling(window=N).min()
    df['RNG'] = df['HHV_H_N'] - df['LLV_L_N']

    df['RSV'] = np.where(
        df['RNG'] == 0,
        50,
        (df['收盘'] - df['LLV_L_N']) / df['RNG'] * 100
    )

    df['K'] = df['RSV'].rolling(window=3).mean()
    df['D'] = df['K'].rolling(window=3).mean()
    df['J'] = 3 * df['K'] - 2 * df['D']

    ema1 = df['收盘'].ewm(span=10, adjust=False).mean()
    df['ZXDQ'] = ema1.ewm(span=10, adjust=False).mean()

    df['MA_M1'] = df['收盘'].rolling(window=M1).mean()
    df['MA_M2'] = df['收盘'].rolling(window=M2).mean()
    df['MA_M3'] = df['收盘'].rolling(window=M3).mean()
    df['MA_M4'] = df['收盘'].rolling(window=M4).mean()
    df['ZXDKX'] = (df['MA_M1'] + df['MA_M2'] + df['MA_M3'] + df['MA_M4']) / 4

    return df


def check_signal(df):
    if len(df) < 114:
        return False

    last = df.iloc[-1]
    return (last['J'] < 0 and
            last['收盘'] > last['ZXDKX'] and
            last['ZXDQ'] > last['ZXDKX'])


def get_all_a_stocks():
    try:
        stock_list = ak.stock_info_a_code_name()
        return stock_list
    except Exception as e:
        print(f"获取股票列表失败: {e}")
        return pd.DataFrame()


def get_stock_data(code, period="daily"):
    try:
        df = ak.stock_zh_a_hist(symbol=code, period=period, adjust="qfq")
        return df
    except Exception as e:
        return pd.DataFrame()


def format_stock_code(code):
    code_str = str(code).zfill(6)
    if code_str.startswith('6'):
        return f"{code_str}.SH"
    else:
        return f"{code_str}.SZ"


def main():
    print("正在获取A股股票列表...")
    stock_list = get_all_a_stocks()

    if stock_list.empty:
        print("无法获取股票列表")
        return

    selected_stocks = {}
    total = len(stock_list)

    for idx, row in stock_list.iterrows():
        code = str(row['code']).zfill(6)
        name = row['name']

        print(f"[{idx + 1}/{total}] 正在分析 {code} {name}...", end='\r')

        df = get_stock_data(code)
        if df.empty:
            continue

        df = calculate_technical_indicators(df)

        if check_signal(df):
            formatted_code = format_stock_code(code)
            selected_stocks[code] = formatted_code
            print(f"\n发现符合条件的股票: {code} -> {formatted_code}")

    print(f"\n分析完成! 共筛选出 {len(selected_stocks)} 只股票")

    with open('/workspace/test_stocks.json', 'w', encoding='utf-8') as f:
        json.dump(selected_stocks, f, ensure_ascii=False, indent=2)

    print("结果已保存到 test_stocks.json")


if __name__ == "__main__":
    main()
