using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SignalrServer.Hubs
{
    public class MyHub : Hub
    {
        [HubMethodName("BroadcastMessage")]
        public async Task SendMessageToClients(string file)
        {
            await Clients.All.SendAsync("ReceiveMessage", file);
        }
    }
}
