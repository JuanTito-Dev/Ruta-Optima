using ProeyectoGoogleMaps.Hubs;
using ProeyectoGoogleMaps.Data;
var builder = WebApplication.CreateBuilder(args);

//Conexion signalR
builder.Services.AddSignalR();

builder.Services.AddRazorPages();

builder.Services.AddSingleton<Datos>();

builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy =>
        policy.WithOrigins("https://localhost:7210/")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseStaticFiles();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapRazorPages();

app.MapHub<HubSignalR>("/Conexion/SignalR");

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
    

app.Run();
