using Common.Entities;
using DAL.Contracts;
using System;
using System.Collections.Generic;
using System.Configuration;

namespace DAL.Memory
{
    public class UsersRepository : IUsersRepository
    {
        private static readonly string _connectionString = ConfigurationManager.ConnectionStrings["Structural_Proof_System_DB"].ConnectionString;

        public void SaveUser(User user)
        {
            string procedure = "SaveUser";

            var param = new KeyValuePair<string, object>[]
            {
                new KeyValuePair<string, object>("@Id", user.Id),
                new KeyValuePair<string, object>("@Name", user.Name),
                new KeyValuePair<string, object>("@Password", user.Password),
                new KeyValuePair<string, object>("@Age", user.Age),
                new KeyValuePair<string, object>("@Avatar", user.Avatar)
            };

            CommonMethods.GetSQLInstruction(_connectionString, procedure, param);
        }

        public bool UpdateUser(User user)
        {
            string procedure = "UpdateUser";

            var param = new KeyValuePair<string, object>[]
            {
                new KeyValuePair<string, object>("@Id", user.Id),
                new KeyValuePair<string, object>("@Name", user.Name),
                new KeyValuePair<string, object>("@Password", user.Password),
                new KeyValuePair<string, object>("@Age", user.Age),
                new KeyValuePair<string, object>("@Avatar", user.Avatar)
            };

            return CommonMethods.GetSQLInstruction(_connectionString, procedure, param);
        }

        public User GetUserById(Guid id)
        {
            User user = null;
            string procedure = "GetUserById";

            var param = new KeyValuePair<string, object>[]
            {
                new KeyValuePair<string, object>("@Id", id),
            };

            var data = CommonMethods.GetSQLReaders(_connectionString, procedure, param);

            foreach (var obj in data)
            {
                Guid _id = (Guid)obj["Id"];
                string name = obj["Name"].ToString();
                string password = obj["Password"].ToString();
                int age = (int)obj["Age"];
                string ava = obj["Avatar"].ToString() == "" ? null : obj["Avatar"].ToString();

                user = new User(name, age, ava)
                {
                    Password = password,
                    Id = _id
                };
            }

            return user;
        }

        public bool DeleteUserById(Guid id)
        {
            string procedure = "DeleteUserById";

            var param = new KeyValuePair<string, object>[]
            {
                new KeyValuePair<string, object>("@Id", id),
            };

            return CommonMethods.GetSQLInstruction(_connectionString, procedure, param);
        }

        public IEnumerable<User> GetAllUsers()
        {
            string procedure = "GetAllUsers";
            var data = CommonMethods.GetSQLReaders(_connectionString, procedure);
            var users = new LinkedList<User>();

            foreach (var obj in data)
            {
                Guid id = (Guid)obj["Id"];
                string name = obj["Name"].ToString();
                string password = obj["Password"].ToString();
                int age = (int)obj["Age"];
                string ava = obj["Avatar"].ToString() == "" ? null : obj["Avatar"].ToString();

                var user = new User(name, age, ava)
                {
                    Password = password,
                    Id = id
                };

                users.AddLast(user);
            }

            return users;
        }

        public User GetUserByName(string name)
        {
            User user = null;
            string procedure = "GetUserByName";

            var param = new KeyValuePair<string, object>[]
            {
                new KeyValuePair<string, object>("@Name", name),
            };

            var data = CommonMethods.GetSQLReaders(_connectionString, procedure, param);

            foreach (var obj in data)
            {
                Guid id = (Guid)obj["Id"];
                string _name = obj["Name"].ToString();
                string password = obj["Password"].ToString();
                int age = (int)obj["Age"];
                string ava = obj["Avatar"].ToString() == "" ? null : obj["Avatar"].ToString();

                user = new User(_name, age, ava)
                {
                    Password = password,
                    Id = id
                };
            }

            return user;
        }

        public bool IsRegistered(string name, string password)
        {
            string procedure = "IsRegistered";

            var param = new KeyValuePair<string, object>[]
            {
                new KeyValuePair<string, object>("@Name", name),
                new KeyValuePair<string, object>("@Password", password)
            };

            var data = CommonMethods.GetSQLObject(_connectionString, procedure, param);

            return (int)data > 0;
        }

        public bool SetPassword(Guid id, string password)
        {
            string procedure = "SetPassword";

            var param = new KeyValuePair<string, object>[]
            {
                new KeyValuePair<string, object>("@Id", id),
                new KeyValuePair<string, object>("@Password", password)
            };

            return CommonMethods.GetSQLInstruction(_connectionString, procedure, param);
        }
    }
}
