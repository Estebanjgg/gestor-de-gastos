// components/ExpenseList.js
export default function ExpenseList({ expenses, onRemoveExpense }) {
  return (
    <div>
      <h3>Gastos Agregados</h3>
      {expenses.length === 0 ? (
        <p>No hay gastos agregados.</p>
      ) : (
        <ul style={styles.list}>
          {expenses.map((expense, index) => (
            <li key={index} style={styles.listItem}>
              <span>
                <strong>{expense.category}:</strong> {expense.title} - ${expense.amount.toFixed(2)}
              </span>
              <button onClick={() => onRemoveExpense(index)} style={styles.removeButton}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '4px',
  },
  removeButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};
