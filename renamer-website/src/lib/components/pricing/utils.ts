import Stripe from "stripe";

export async function checkout(product: Stripe.Price) {
    await fetch("/api/purchase", {
        method: "POST",
        body: JSON.stringify({product}),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
            if (res.ok) {
                res.json().then(
                    body => {
                        // open new page to download the product
                        window.open(body.url, "_blank");
                    }
                );
            } else {
                alert("an error occurred");
            }
        }
    );
}