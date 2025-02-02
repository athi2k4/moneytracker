function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      fetch(`/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            document.getElementById(`transaction-${id}`).remove();
          } else {
            alert('Failed to delete transaction.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }