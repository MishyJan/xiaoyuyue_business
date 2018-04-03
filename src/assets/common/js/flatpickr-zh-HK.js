/* Mandarin locals for flatpickr */
var flatpickr = flatpickr || {
    l10ns: {}
};
flatpickr.l10ns.hk = {};

flatpickr.l10ns.hk.weekdays = {
    shorthand: ["日", "一", "二", "三", "四", "五", "六"],
    longhand: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
};

flatpickr.l10ns.hk.months = {
    shorthand: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    longhand: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
};

flatpickr.l10ns.hk.rangeSeparator = " 至 ";
flatpickr.l10ns.hk.weekAbbreviation = "周";
flatpickr.l10ns.hk.scrollTitle = "滾動切換";
flatpickr.l10ns.hk.toggleTitle = "點擊切換 12/24 小時時制";

if (typeof module !== "undefined") module.exports = flatpickr.l10ns;