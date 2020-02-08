from pyecharts.charts import Map
from pyecharts import options as opts

# 省和直辖市
province_distribution = {'河南': 566, '北京': 212, '河北': 21, '辽宁': 12, '江西': 391, '上海': 203, '安徽': 408, '江苏': 271,
                         '湖南': 521, '浙江': 724, '海南': 2, '广东': 725, '湖北': 11177, '黑龙江': 121, '澳门': 1, '陕西': 128,
                         '四川': 254,
                         '内蒙古': 3, '重庆': 312, '云南': 6, '贵州': 2, '吉林': 3, '山西': 12, '山东': 259, '福建': 179, '青海': 1,
                         '天津': 1, '其他': 1}
provice = list(province_distribution.keys())
values = list(province_distribution.values())

c = (
    Map()
        .add("确诊人数", [list(z) for z in zip(provice, values)], "china")
        .set_series_opts(label_opts=opts.LabelOpts(is_show=False))
        .set_global_opts(
        title_opts=opts.TitleOpts(title="全国实时疫情分布地图"),
        visualmap_opts=opts.VisualMapOpts(max_=1000), )
)