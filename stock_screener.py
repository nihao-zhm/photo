import akshare as ak
import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta

def get_all_a_stocks():
    """获取所有A股代码和名称"""
    print("正在获取A股股票列表...")
    # 获取沪市A股
    sh_df = ak.stock_info_sh_name_code()
    # 获取深市A股
    sz_df = ak.stock_info_sz_name_code()
    
    stocks = {}
    
    # 处理沪市股票
    for _, row in sh_df.iterrows():
        code = row['code']
        if code.startswith('6'):  # 确保是A股
            stocks[code] = f"{code}.SH"
    
    # 处理深市股票
    for _, row in sz_df.iterrows():
        code = row['code']
        if code.startswith(('0', '3')):  # 确保是A股或创业板
            stocks[code] = f"{code}.SZ"
    
    print(f"共获取 {len(stocks)} 只A股股票")
    return stocks

def sma(x, n, m):
    """通达信SMA计算: SMA(X,N,M) = (X*M + 前一日SMA*(N-M))/N"""
    result = np.zeros_like(x)
    result[0] = x[0]
    for i in range(1, len(x)):
        result[i] = (x[i] * m + result[i-1] * (n - m)) / n
    return result

def calculate_indicators(df):
    """计算技术指标"""
    if len(df) < 120:  # 需要足够的数据
        return None
        
    N = 9
    M1, M2, M3, M4 = 14, 28, 57, 114
    
    # 确保数据按日期升序排列
    df = df.sort_index()
    
    # 计算高低价区间
    hhv = df['high'].rolling(N).max()
    llv = df['low'].rolling(N).min()
    rng = hhv - llv
    
    # 计算RSV
    rsv = np.where(rng == 0, 50, (df['close'] - llv) / rng * 100)
    
    # 计算K、D、J (通达信SMA)
    k = sma(rsv, 3, 1)
    d = sma(k, 3, 1)
    j = 3 * k - 2 * d
    
    # 计算知行短期趋势线 (EMA(EMA(C,10),10))
    ema1 = df['close'].ewm(span=10, adjust=False).mean()
    zxdq = ema1.ewm(span=10, adjust=False).mean()
    
    # 计算知行多空线
    ma1 = df['close'].rolling(M1).mean()
    ma2 = df['close'].rolling(M2).mean()
    ma3 = df['close'].rolling(M3).mean()
    ma4 = df['close'].rolling(M4).mean()
    zxdkx = (ma1 + ma2 + ma3 + ma4) / 4
    
    # 最新值
    latest_c = df['close'].iloc[-1]
    latest_j = j[-1]
    latest_zxdq = zxdq.iloc[-1]
    latest_zxdkx = zxdkx.iloc[-1]
    
    # 选股条件：J<0 AND C>ZXDKX AND ZXDQ>ZXDKX
    is_match = (latest_j < 0) and (latest_c > latest_zxdkx) and (latest_zxdq > latest_zxdkx)
    
    return {
        'match': is_match,
        'j': latest_j,
        'c': latest_c,
        'zxdq': latest_zxdq,
        'zxdkx': latest_zxdkx
    }

def get_stock_data(stock_code):
    """获取股票历史数据"""
    try:
        # 获取最近一年的日线数据
        end_date = datetime.now().strftime('%Y%m%d')
        start_date = (datetime.now() - timedelta(days=365)).strftime('%Y%m%d')
        
        # 根据代码前缀判断是沪市还是深市
        if stock_code.startswith('6'):
            symbol = f"sh{stock_code}"
        else:
            symbol = f"sz{stock_code}"
        
        df = ak.stock_zh_a_hist(symbol=symbol, period="daily", 
                               start_date=start_date, end_date=end_date)
        
        # 重命名列名，方便处理
        df = df.rename(columns={
            '日期': 'date',
            '开盘': 'open',
            '收盘': 'close',
            '最高': 'high',
            '最低': 'low',
            '成交量': 'volume',
            '成交额': 'amount'
        })
        
        # 设置日期索引
        df['date'] = pd.to_datetime(df['date'])
        df = df.set_index('date')
        
        return df
    except Exception as e:
        print(f"获取 {stock_code} 数据失败: {e}")
        return None

def main():
    print("="*50)
    print("A股选股程序启动")
    print("="*50)
    
    # 获取所有A股代码
    all_stocks = get_all_a_stocks()
    
    # 筛选符合条件的股票
    matching_stocks = {}
    total = len(all_stocks)
    
    for i, (code, full_code) in enumerate(all_stocks.items(), 1):
        if i % 50 == 0:
            print(f"进度: {i}/{total} ({i/total*100:.1f}%)")
        
        # 获取数据
        df = get_stock_data(code)
        if df is None or len(df) < 120:
            continue
        
        # 计算指标并判断
        result = calculate_indicators(df)
        if result and result['match']:
            matching_stocks[code] = full_code
            print(f"✓ 发现符合条件的股票: {code} - J={result['j']:.2f}")
    
    # 保存结果
    output_file = "/workspace/test_stocks.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(matching_stocks, f, ensure_ascii=False, indent=2)
    
    print("\n" + "="*50)
    print(f"选股完成！共找到 {len(matching_stocks)} 只符合条件的股票")
    print(f"结果已保存到: {output_file}")
    print("="*50)
    
    return matching_stocks

if __name__ == "__main__":
    main()
