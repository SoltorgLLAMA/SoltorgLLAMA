#pragma checksum "/home/jesper/SoltorgLLAMA/clients/llamaClient/Shared/MainLayout.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "b0f24a31c05ef84282e48fe10b4574d2f4c9daaf"
// <auto-generated/>
#pragma warning disable 1591
namespace llamaClient.Shared
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Components;
#nullable restore
#line 1 "/home/jesper/SoltorgLLAMA/clients/llamaClient/_Imports.razor"
using System.Net.Http;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "/home/jesper/SoltorgLLAMA/clients/llamaClient/_Imports.razor"
using Microsoft.AspNetCore.Authorization;

#line default
#line hidden
#nullable disable
#nullable restore
#line 3 "/home/jesper/SoltorgLLAMA/clients/llamaClient/_Imports.razor"
using Microsoft.AspNetCore.Components.Authorization;

#line default
#line hidden
#nullable disable
#nullable restore
#line 4 "/home/jesper/SoltorgLLAMA/clients/llamaClient/_Imports.razor"
using Microsoft.AspNetCore.Components.Forms;

#line default
#line hidden
#nullable disable
#nullable restore
#line 5 "/home/jesper/SoltorgLLAMA/clients/llamaClient/_Imports.razor"
using Microsoft.AspNetCore.Components.Routing;

#line default
#line hidden
#nullable disable
#nullable restore
#line 6 "/home/jesper/SoltorgLLAMA/clients/llamaClient/_Imports.razor"
using Microsoft.AspNetCore.Components.Web;

#line default
#line hidden
#nullable disable
#nullable restore
#line 7 "/home/jesper/SoltorgLLAMA/clients/llamaClient/_Imports.razor"
using Microsoft.AspNetCore.Components.Web.Virtualization;

#line default
#line hidden
#nullable disable
#nullable restore
#line 8 "/home/jesper/SoltorgLLAMA/clients/llamaClient/_Imports.razor"
using Microsoft.JSInterop;

#line default
#line hidden
#nullable disable
#nullable restore
#line 9 "/home/jesper/SoltorgLLAMA/clients/llamaClient/_Imports.razor"
using llamaClient;

#line default
#line hidden
#nullable disable
#nullable restore
#line 10 "/home/jesper/SoltorgLLAMA/clients/llamaClient/_Imports.razor"
using llamaClient.Shared;

#line default
#line hidden
#nullable disable
    public partial class MainLayout : LayoutComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
            __builder.OpenElement(0, "div");
            __builder.AddAttribute(1, "class", "page");
            __builder.AddAttribute(2, "b-pkxhqxyqec");
            __builder.OpenElement(3, "div");
            __builder.AddAttribute(4, "class", "sidebar");
            __builder.AddAttribute(5, "b-pkxhqxyqec");
            __builder.OpenComponent<llamaClient.Shared.NavMenu>(6);
            __builder.CloseComponent();
            __builder.CloseElement();
            __builder.AddMarkupContent(7, "\n\n    ");
            __builder.OpenElement(8, "div");
            __builder.AddAttribute(9, "class", "main");
            __builder.AddAttribute(10, "b-pkxhqxyqec");
            __builder.AddMarkupContent(11, "<div class=\"top-row px-4\" b-pkxhqxyqec><a href=\"https://docs.microsoft.com/aspnet/\" target=\"_blank\" b-pkxhqxyqec>About</a></div>\n\n        ");
            __builder.OpenElement(12, "div");
            __builder.AddAttribute(13, "class", "content px-4");
            __builder.AddAttribute(14, "b-pkxhqxyqec");
            __builder.AddContent(15, 
#nullable restore
#line 14 "/home/jesper/SoltorgLLAMA/clients/llamaClient/Shared/MainLayout.razor"
             Body

#line default
#line hidden
#nullable disable
            );
            __builder.CloseElement();
            __builder.CloseElement();
            __builder.CloseElement();
        }
        #pragma warning restore 1998
    }
}
#pragma warning restore 1591
