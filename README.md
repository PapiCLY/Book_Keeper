# Book_Keeper

<!--
<div class="book-card">
    <% if (data) { %>
        <h3><%= data.title || "Unknown" %></h3>
        <p><strong>Author:</strong> <%= data.author_name ? data.author_name[0] : "Unknown" %></p>
        <p><strong>Published Year:</strong> <%= data.first_publish_year || "Unknown" %></p>

        <% if (bookCover) { %>
            <img src="<%= bookCover %>" alt="Book Cover" class="book-cover">
        <% } else { %>
            <p>No cover available.</p>
        <% } %>
-->


<!--
         Add to Database Button 
        <form action="/add" method="POST">
            <input type="hidden" name="title" value="<%= data.title %>">
            <input type="hidden" name="author" value="<%= data.author_name ? data.author_name[0] : 'Unknown' %>">
            <input type="hidden" name="year" value="<%= data.first_publish_year || 'Unknown' %>">
            <input type="hidden" name="cover" value="<%= bookCover %>">
            <button type="submit" class="btn add-btn">Add</button>
        </form>
    -->

    <!--
         Delete from Database Button 
        <form action="/delete" method="POST">
            <input type="hidden" name="title" value="<%= data.title %>">
            <button type="submit" class="btn delete-btn">Delete</button>
        </form>

    <% } else if (error) { %>
        <h3 style="color: red;"><%= error %></h3>
    <% } %>
</div>
-->