using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace DAL.Memory
{
    public static class CommonMethods
    {
        public static SqlCommand GetSQLCommand(SqlConnection conn, string proc, params KeyValuePair<string, object>[] parameters)
        {
            var command = new SqlCommand(proc, conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            foreach (var param in parameters)
            {
                command.Parameters.AddWithValue(param.Key, param.Value);
            }
            return command;
        }

        public static IEnumerable<SqlDataReader> GetSQLReaders(string connectionString, string proc, params KeyValuePair<string, object>[] parameters)
        {
            using (var _connection = new SqlConnection(connectionString))
            {
                _connection.Open();

                var reader = GetSQLCommand(_connection, proc, parameters).ExecuteReader();

                while (reader.Read())
                {
                    yield return reader;
                }
            }
        }

        public static object GetSQLObject(string connectionString, string proc, params KeyValuePair<string, object>[] parameters)
        {
            using (var _connection = new SqlConnection(connectionString))
            {
                _connection.Open();

                var scalar = GetSQLCommand(_connection, proc, parameters).ExecuteScalar();

                return scalar;
            }
        }

        public static bool GetSQLInstruction(string connectionString, string procedure, params KeyValuePair<string, object>[] parameters)
        {
            using (var _connection = new SqlConnection(connectionString))
            {
                _connection.Open();

                var result = GetSQLCommand(_connection, procedure, parameters).ExecuteNonQuery();

                return result > 0;
            }
        }
    }
}
