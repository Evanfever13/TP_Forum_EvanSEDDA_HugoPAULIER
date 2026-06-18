async function votePost(postId, value) {
    const userId = getUserIdFromCookie();
    if (!userId) {
        alert("Vous devez être connecté pour voter.");
        return null;
    }

    const res = await fetch(`/api/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            id_users: Number(userId),
            id_posts: Number(postId),
            vote: value
        })
    });

    if (!res.ok) return null;

    return await res.json();
}
