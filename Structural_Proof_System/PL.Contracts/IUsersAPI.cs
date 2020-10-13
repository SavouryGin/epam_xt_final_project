using Common.Entities;
using System;
using System.Collections.Generic;

namespace PL.Contracts
{
    public interface IUsersAPI
    {
        UserStatus AddUser(User user);

        UserStatus CheckUser(User user);

        User GetUserById(Guid id);

        User GetUserByName(string name);

        bool UpdateUserById(Guid id, User user);

        void DeleteUserById(Guid id);

        IEnumerable<User> GetAllUsers();

        bool IsRegistered(string name, string password);

        bool SetPassword(Guid id, string password);
    }
}
