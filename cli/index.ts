#!/usr/bin/env node
import { Command } from 'commander';
import { SearchService } from '../api/searchService';
import { DataProcessor } from '../api/dataProcessor';
import { PLATFORMS } from '../shared/types';

const program = new Command();

program
  .name('price-compare')
  .description('电商商品价格自动化采集与对比工具')
  .version('1.0.0');

program
  .command('search')
  .description('搜索商品')
  .argument('<keyword>', '搜索关键词')
  .option('-p, --platforms <platforms...>', '指定平台 (jd, taobao, pinduoduo)')
  .option('-l, --limit <number>', '结果数量限制', parseInt)
  .option('-s, --sort <field>', '排序字段 (price, sales, rating)', 'price')
  .option('-o, --order <order>', '排序方式 (asc, desc)', 'asc')
  .action(async (keyword, options) => {
    console.log(`\n🔍 正在搜索 "${keyword}"...\n`);
    
    try {
      const products = await SearchService.search({
        keyword,
        platforms: options.platforms,
        limit: options.limit
      });

      let sortedProducts = DataProcessor.sortProducts(
        products, 
        options.sort as any, 
        options.order as any
      );

      console.log(`✅ 找到 ${sortedProducts.length} 个商品\n`);
      
      const stats = DataProcessor.getPriceStatistics(sortedProducts);
      console.log('📊 价格统计:');
      console.log(`   最低: ¥${stats.min}`);
      console.log(`   最高: ¥${stats.max}`);
      console.log(`   平均: ¥${stats.avg}`);
      console.log(`   中位数: ¥${stats.median}\n`);

      console.log('📦 商品列表:');
      console.log('─'.repeat(100));
      
      sortedProducts.forEach((product, index) => {
        const platform = PLATFORMS[product.platform];
        const discount = product.originalPrice 
          ? ` (${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF)` 
          : '';
        
        console.log(`${index + 1}. ${platform.icon} [${platform.name}] ${product.name}`);
        console.log(`   💰 价格: ¥${product.price}${discount}`);
        console.log(`   📈 销量: ${product.sales.toLocaleString()} | ⭐ 评分: ${product.rating}`);
        console.log(`   🏪 店铺: ${product.shopName}`);
        console.log(`   🏆 性价比: ${product.costPerformance?.toFixed(1)}分`);
        console.log('─'.repeat(100));
      });

    } catch (error) {
      console.error('❌ 搜索失败:', error);
      process.exit(1);
    }
  });

program
  .command('sample')
  .description('查看示例数据')
  .action(async () => {
    console.log('\n📋 加载示例数据...\n');
    
    try {
      const products = await SearchService.getSampleData();
      
      console.log(`✅ 加载 ${products.length} 个示例商品\n`);
      
      products.slice(0, 5).forEach((product, index) => {
        const platform = PLATFORMS[product.platform];
        console.log(`${index + 1}. ${platform.icon} [${platform.name}] ${product.name}`);
        console.log(`   💰 ¥${product.price} | 📈 ${product.sales} | ⭐ ${product.rating}`);
      });
      
      if (products.length > 5) {
        console.log(`\n... 还有 ${products.length - 5} 个商品`);
      }
      
    } catch (error) {
      console.error('❌ 加载失败:', error);
      process.exit(1);
    }
  });

program.parse();
