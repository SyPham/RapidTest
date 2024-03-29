﻿using System;

namespace RapidTest.Constants
{
    public static class ErrorKindMessage
    {
        public static string WRONG_CODE = $"System can not recognize this ID!{Environment.NewLine}Hệ thống không thể nhận diện số thẻ!";
        public static string SEA_INFORM = $"SEA have not informed this person to go to work!{Environment.NewLine}Nhân sự chưa thông báo người này đi làm!";
        public static string BLACK_LIST = $"This person is in SEA blacklist, he/she can not pass this station!{Environment.NewLine}Người này nằm trong danh sách đen của nhân sự, không được để anh ấy hoặc cô ấy đi qua chốt này!";
        public static string NOT_ENOUGHT_WAITING_TIME = $"Not enough waiting time!{Environment.NewLine}Chưa đủ thời gian chờ kết quả xét nghiệm!";
        public static string NOT_CHECK_IN_ACCESS_CONTROL = $"This person did check in and skipped check out!{Environment.NewLine}Người này có check in and bỏ check out!";
        public static string NOT_CHECK_IN = $"This person did skip check in!{Environment.NewLine}Người này bỏ check in!";
        public static string DEADLINE_IS_OVER = $"Entry factory date was expired{Environment.NewLine}Kết quả xét nghiệm đã hết hiệu lực!";
        public static string ALREADY_CHECK_IN = $"Check in twice at the same time!{Environment.NewLine} Đã xét nghiệm!";
        public static string ALREADY_CHECK_OUT = $"Check out twice at the same time!{Environment.NewLine} Đã có kết quả xét nghiệm!";
        public static string WRONG_SCHEDULE = $"Get rapid test wrong schedule!{Environment.NewLine} Xét nghiệm sai lịch!";
    }
}
