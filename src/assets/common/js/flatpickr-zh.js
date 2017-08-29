/* Mandarin locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.zh = {};

Flatpickr.l10ns.zh.weekdays = {
    shorthand: ["日", "一", "二", "三", "四", "五", "六"],
    longhand: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
};

Flatpickr.l10ns.zh.months = {
    shorthand: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    longhand: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
};

Flatpickr.l10ns.zh.rangeSeparator = " 至 ";
Flatpickr.l10ns.zh.weekAbbreviation = "周";
Flatpickr.l10ns.zh.scrollTitle = "滚动切换";
Flatpickr.l10ns.zh.toggleTitle = "点击切换 12/24 小时时制";

if (typeof module !== "undefined")
    module.exports = Flatpickr.l10ns;