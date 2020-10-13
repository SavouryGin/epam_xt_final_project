using BLL.Contracts;
using Common.BLL.DR;
using Common.Entities;
using PL.Contracts;
using System;
using System.Collections.Generic;

namespace PL.Web.API
{
    public class UsersAPI : IUsersAPI
    {
        private readonly IUsersLogic _logic = UsersLogicDR.UsersBLL;

        public UserStatus AddUser(User user) => _logic.AddUser(user);

        public UserStatus CheckUser(User user) => _logic.CheckUser(user);

        public void DeleteUserById(Guid id) => _logic.DeleteUserById(id);

        public IEnumerable<User> GetAllUsers() => _logic.GetAllUsers();

        public User GetUserById(Guid id) => _logic.GetUserById(id);

        public User GetUserByName(string name) => _logic.GetUserByName(name);

        public bool IsRegistered(string name, string password) => _logic.IsRegistered(name, password);

        public bool SetPassword(Guid id, string password) => _logic.SetPassword(id, password);

        public bool UpdateUserById(Guid id, User user) => _logic.UpdateUserById(id, user);
    }
}