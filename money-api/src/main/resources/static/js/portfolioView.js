
// Portfolio ##########################################################################################

// Add this after other initialization code
document.getElementById('buyPortfolio')?.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('buyPortfolioModal'));
    modal.show();
  });
  
  document.getElementById('buyPortfolioForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const ticker = formData.get('ticker').toUpperCase().trim();
    const quantity = parseInt(formData.get('quantity'), 10);
    const price = formData.get('price').replace('$', '');
    
    try {
      // Validate amount format
      if (!/^\d+(\.\d{2})?$/.test(price)) {
        throw new Error('Invalid amount format');
      }
      
      // Convert to cents
      const amountInCents = Math.round(parseFloat(price) * 100);
      
      // Validate positive amount
      if (amountInCents <= 0) {
        throw new Error('Amount must be positive');
      }
  
      const response = await fetch('http://localhost:8080/historyItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          ticker: ticker,
          quantity: quantity,
          price: amountInCents
        })
      });
  
      if (!response.ok) throw new Error('Portfolio transaction failed');
  
      // Show success message
      const successAlert = document.getElementById('portfolioSuccess');
      const errorAlert = document.getElementById('portfolioError');
      successAlert.classList.remove('d-none');
      errorAlert.classList.add('d-none');
      
      // Clear form and close modal
      form.reset();
      setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('buyPortfolioModal'));
        document.getElementsByClassName('modal-backdrop fade show')[0]?.remove();
        modal.hide();
        fetchAndDisplayCash();
        successAlert.classList.add('d-none');
      }, 2000);
  
    } catch (error) {
      console.error('Error making portfolio transaction:', error);
      const errorAlert = document.getElementById('portfolioError');
      errorAlert.classList.remove('d-none');
      setTimeout(() => errorAlert.classList.add('d-none'), 3000);
    }
  });
  
  // Show withdraw modal
  document.getElementById('selPortfolio')?.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('withdrawModal'));
    modal.show();
  });
  
  // Handle withdraw form submit
  document.getElementById('withdrawForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const amountStr = formData.get('amount').replace('$', '');
    
    try {
      // Validate amount format
      if (!/^\d+(\.\d{2})?$/.test(amountStr)) {
        throw new Error('Invalid amount format');
      }
      
      // Convert to cents
      const amountInCents = Math.round(parseFloat(amountStr) * 100);
      
      // Validate positive (user must enter >0)
      if (amountInCents <= 0) {
        throw new Error('Amount must be positive');
      }
  
      // For withdraw, price is negative
      const response = await fetch('http://localhost:8080/historyItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          price: -amountInCents,   // negative for withdraw
          ticker: 'MONEY',
          quantity: 1
        })
      });
  
      if (!response.ok) throw new Error('Withdraw failed');
  
      // Show success message
      const successAlert = document.getElementById('withdrawSuccess');
      const errorAlert = document.getElementById('withdrawError');
      successAlert.classList.remove('d-none');
      errorAlert.classList.add('d-none');
      
      // Clear form and close modal
      form.reset();
      setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('withdrawModal'));
        document.getElementsByClassName('modal-backdrop fade show')[0]?.remove();
        modal.hide();
        fetchAndDisplayCash(); // refresh balance
        successAlert.classList.add('d-none');
      }, 2000);
  
    } catch (error) {
      console.error('Error making withdraw:', error);
      const errorAlert = document.getElementById('withdrawError');
      errorAlert.classList.remove('d-none');
      setTimeout(() => errorAlert.classList.add('d-none'), 3000);
    }
  });