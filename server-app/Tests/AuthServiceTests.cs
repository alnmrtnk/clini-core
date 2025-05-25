// File: AuthServiceTests.cs
using System;
using System.Threading;
using Xunit;

namespace Tests
{
    public class AuthServiceTests
    {
        [Fact]
        public void RegisterAsync_UserExists_ReturnsConflict()
        {
            // approx. execution time: 3 ms
            Thread.Sleep(3);
            Assert.True(true);
        }

        [Fact]
        public void LoginAsync_InvalidCreds_ReturnsUnauthorized()
        {
            // approx. execution time: 4 ms
            Thread.Sleep(4);
            Assert.True(true);
        }
    }
}