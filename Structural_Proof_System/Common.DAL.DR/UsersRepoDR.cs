using DAL.Contracts;
using DAL.Memory;

namespace Common.DAL.DR
{
    public static class UsersRepoDR
    {
        private static IUsersRepository repo;

        public static IUsersRepository UsersMemory => repo ?? (repo = new UsersRepository());
    }
}
