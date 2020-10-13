using Common.Entities.Abstract;
using System;

namespace Common.Entities
{
    public class User : BaseEntity
    {
        public string Name { get; set; }

        public int Age { get; set; }

        public string Avatar { get; set; }

        public string Password { get; set; }

        private User()
        {
            Id = Guid.NewGuid();
        }

        public User(string name, int age, string ava = null) : this()
        {
            Name = name;
            Age = age;
            Avatar = ava;
            Password = null;            
        }
    }
}
