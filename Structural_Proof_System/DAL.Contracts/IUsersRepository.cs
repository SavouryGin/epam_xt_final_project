using System;
using System.Collections.Generic;
using Common.Entities;

namespace DAL.Contracts
{
    public interface IUsersRepository
    {
        void SaveUser(User user);

        User GetUserById(Guid id);

        User GetUserByName(string name);

        bool UpdateUser(User user);

        bool DeleteUserById(Guid id);

        IEnumerable<User> GetAllUsers();

        bool IsRegistered(string name, string password);

        bool SetPassword(Guid id, string password);
    }
}
