using BLL.Contracts;
using Common.DAL.DR;
using Common.Entities;
using DAL.Contracts;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace BLL.Logic
{
    public class UsersLogic : IUsersLogic
    {
        private readonly IUsersRepository _usersRepo = UsersRepoDR.UsersMemory;

        public UserStatus CheckUser(User user)
        {
            string namePattern = @"^(?=[a-zA-Z0-9._]{2,25}$)(?!.*[_.]{2})[^_.].*[^_.]$";

            if (!Regex.IsMatch(user.Name, namePattern))
            {
                return UserStatus.InvalidName;
            }

            return _usersRepo.GetUserByName(user.Name) != null ? UserStatus.Exists : UserStatus.Verified;
        }

        public UserStatus AddUser(User user)
        {
            var res = CheckUser(user);

            if (res == UserStatus.Verified)
            {
                _usersRepo.SaveUser(user);
            }

            return res;
        }

        public void DeleteUserById(Guid id) => _usersRepo.DeleteUserById(id);

        public bool UpdateUserById(Guid id, User user)
        {
            var _user = GetUserById(id);

            if (_user == null)
            {
                return false;
            }

            user.Id = id;
            user.Password = _user.Password;

            _usersRepo.UpdateUser(user);

            return true;
        }

        public IEnumerable<User> GetAllUsers() => _usersRepo.GetAllUsers();

        public User GetUserById(Guid id) => _usersRepo.GetUserById(id);

        public User GetUserByName(string name) => _usersRepo.GetUserByName(name);

        public bool IsRegistered(string name, string password) => _usersRepo.IsRegistered(name, password);

        public bool SetPassword(Guid id, string password) => _usersRepo.SetPassword(id, password);
    }
}
