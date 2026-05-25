async function testTara() {
  try {
    const response = await fetch('https://www.dklo.co/api/tara/paymentlinks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: 'eO4qfliMGo6yvkSmPqDPKUoH',
        businessId: '5AuML9WXgI',
        productId: `loyer-${Date.now()}`,
        productName: `Paiement Loyer - Test`,
        amount: 500,
        price: 500,
        productPrice: 500,
        currency: 'EUR',
        productDescription: `Paiement de loyer`,
        productPictureUrl: 'https://placehold.co/400',
        returnUrl: 'https://votre-site-en-production.com/success',
        webHookUrl: 'https://example.com/webhook'
      }),
    });

    const data = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testTara();
