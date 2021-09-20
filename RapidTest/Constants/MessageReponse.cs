using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RapidTest.Constants
{
    public static class MessageReponse
    {
        public static string AddSuccess = "Thêm mới dữ liệu thành công";
        public static string AddError = "Thêm mới dữ liệu thất bại";
        public static string UpdateSuccess = "Cập nhật dữ liệu thành công";
        public static string UpdateError = "Cập nhật dữ liệu thất bại";
        public static string DeleteSuccess = "Xóa thành công";
        public static string DeleteError = "Xóa thất bại";
        public static string NotFoundData = "Dữ liệu không còn tồn tại trong hệ thống";

        public static string LockSuccess = "Khóa tài khoản thành công";
        public static string UnlockSuccess = "Mở khóa tài khoản thành công";

        public static string Exist = "Đã tồn tại";
        public static string Invalid = "Không hợp lệ";
    }
}
