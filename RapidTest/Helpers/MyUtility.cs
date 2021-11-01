using NetUtility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace RapidTest.Helpers
{
    public static class MyUtility
    {
        private static readonly string _Salt = "K6KVX-6NWTF-2JPJ3-Q29H6-H8RC6";
        public static string ToEncryptPassword(this string password)
        {
            if (string.IsNullOrEmpty(password)) return "";
            var ASCIIENC = new ASCIIEncoding();
            string strreturn;
            strreturn = string.Empty;
            var bytesourcetxt = ASCIIENC.GetBytes(password);
            var SHA1Hash = new SHA1CryptoServiceProvider();
            byte[] bytehash = SHA1Hash.ComputeHash(bytesourcetxt);
            foreach (byte b in bytehash)
                strreturn += b.ToString("X2");
            return strreturn;
        }
       
        public static string ToEncrypt(this string password, string salt = "")
        {
            if (string.IsNullOrEmpty(salt))
                salt = _Salt;
            var data = Encoding.UTF8.GetBytes(password);

            using (var md5 = new MD5CryptoServiceProvider())
            {
                var keys = md5.ComputeHash(Encoding.UTF8.GetBytes(salt));
                using (var tripDes = new TripleDESCryptoServiceProvider { Key = keys, Mode = CipherMode.ECB, Padding = PaddingMode.PKCS7 })
                {
                    var transform = tripDes.CreateEncryptor();
                    var results = transform.TransformFinalBlock(data, 0, data.Length);
                    return Convert.ToBase64String(results, 0, results.Length);
                }
            }
        }
        public static bool IsBase64(this string base64String)
        {
            if (base64String.Replace(" ", "").Length % 4 != 0)
            {
                return false;
            }

            try
            {
                Convert.FromBase64String(base64String);
                return true;
            }
            catch
            {
                // Handle the exception
            }
            return false;
        }
        public static string ToDecrypt(this string password, string salt = "")
        {
            if (string.IsNullOrEmpty(salt))
                salt = _Salt;
            var data = Convert.FromBase64String(password);
            using (var md5 = new MD5CryptoServiceProvider())
            {
                var keys = md5.ComputeHash(Encoding.UTF8.GetBytes(salt));

                using (var tripDes = new TripleDESCryptoServiceProvider()
                {
                    Key = keys,
                    Mode = CipherMode.ECB,
                    Padding = PaddingMode.PKCS7
                })
                {
                    var transform = tripDes.CreateDecryptor();
                    var results = transform.TransformFinalBlock(data, 0, data.Length);
                    return Encoding.UTF8.GetString(results);
                }
            }
        }
        public static DateTime ToRemoveSecond(this DateTime dateTime)
        {
            var timeNow = dateTime;
            timeNow = timeNow.AddSeconds(-timeNow.Second);
            timeNow = timeNow.AddTicks(-(timeNow.Ticks % 10000000));
            return timeNow;
        }
        public static string ToCamelCase(this string str)
        {
            if (!string.IsNullOrEmpty(str) && str.Length > 1)
            {
                return char.ToLowerInvariant(str[0]) + str.Substring(1);
            }
            return str;
        }
        public static string ToPascalCase(this string s)
        {
            // Find word parts using the following rules:
            // 1. all lowercase starting at the beginning is a word
            // 2. all caps is a word.
            // 3. first letter caps, followed by all lowercase is a word
            // 4. the entire string must decompose into words according to 1,2,3.
            // Note that 2&3 together ensure MPSUser is parsed as "MPS" + "User".

            var m = Regex.Match(s, "^(?<word>^[a-z]+|[A-Z]+|[A-Z][a-z]+)+$");
            var g = m.Groups["word"];

            // Take each word and convert individually to TitleCase
            // to generate the final output.  Note the use of ToLower
            // before ToTitleCase because all caps is treated as an abbreviation.
            var t = Thread.CurrentThread.CurrentCulture.TextInfo;
            var sb = new StringBuilder();
            foreach (var c in g.Captures.Cast<Capture>())
                sb.Append(t.ToTitleCase(c.Value.ToLower()));
            return sb.ToString();
        }
        public static IQueryable<T> EJ2OrderBy<T>(this IQueryable<T> source, string ordering)
        {
            string method = string.Empty;
            string orderbyValue = string.Empty;
            if (ordering.ToSafetyString() != string.Empty && ordering != "option")
            {
                var orderTemp = ordering.Split(" ");
                if (orderTemp.Length > 1)
                {
                    orderbyValue = orderTemp[0];
                    method = "OrderByDescending";
                }
                else
                {
                    orderbyValue = ordering;
                    method = "OrderBy";

                }

            var type = typeof(T);
                var propertyValue = type.GetProperties().FirstOrDefault(x => x.Name.ToLower().Equals(orderbyValue.ToLower()));
            var property = type.GetProperty(propertyValue.Name);
            var parameter = Expression.Parameter(type, "p");
            var propertyAccess = Expression.MakeMemberAccess(parameter, property);
            var orderByExp = Expression.Lambda(propertyAccess, parameter);
            MethodCallExpression resultExp = Expression.Call(typeof(Queryable), method, new Type[] { type, property.PropertyType }, source.Expression, Expression.Quote(orderByExp));
            return source.Provider.CreateQuery<T>(resultExp);
            }
            return source;
        }

    }
}
