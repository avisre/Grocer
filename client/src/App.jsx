import { useState, useEffect } from 'react';
import Axios from 'axios';
import './App.css';

function App() {
  const [count, setCount] = useState('');
  const [name, setName] = useState('');
  const [metric, setMetric] = useState('');
  const [num, setNum] = useState(0);
  const [list, setList] = useState([]);
  const [editMode, setEditMode] = useState({});

  useEffect(() => {
    Axios.get('http://localhost:5000/read').then((response) => {
      setList(response.data);
    });
  }, []);

  const add = async () => {
    await Axios.post('http://localhost:5000/insert', { count: count, num: num, metric: metric });
    const response = await Axios.get('http://localhost:5000/read');
    setList(response.data);
    setCount('');
    setNum(0);
    setMetric('');
  };

  const updateFood = async (id) => {
    try {
      await Axios.put('http://localhost:5000/update', { id: id, name: name });
      const response = await Axios.get('http://localhost:5000/read');
      setList(response.data);
      setEditMode({ ...editMode, [id]: false });
      setName('');
    } catch (error) {
      console.error('Error updating food:', error);
    }
  };

  const deleteFood = async (id) => {
    try {
      await Axios.delete(`http://localhost:5000/delete/${id}`);
      const response = await Axios.get('http://localhost:5000/read');
      setList(response.data);
    } catch (error) {
      console.error('Error deleting food:', error);
    }
  };

  return (
    <>
      <h1>Grocers</h1>
      <div className="App">

        <label htmlFor="name">Enter Food Item</label>
        <input
          type="text"
          id="name"
          value={count}
          placeholder='Foodstuff '
          onChange={(e) => {
            setCount(e.target.value);
          }}
        />
        <label htmlFor="num">Enter quantity</label>
        <input
          type="number"
          id="num"
          value={num}
          onChange={(e) => {
            setNum(e.target.value);
          }}
        />
        <label htmlFor="pet-select">Metrics</label>
        <select

          className='Custom'
          name="pets"
          id="pet-select"
          value={metric}
          onChange={(e) => {
            setMetric(e.target.value);
          }}
        >
          <option value=''>Select One</option>
          <option value="Kg">Kg</option>
          <option value="L">L</option>
          <option value="Nos">Nos</option>
        </select>
        <button onClick={add}>Add</button>
      </div>
      <div className='Items'>
        {list.map((d, index) => {
          return (
            <div className='Item' key={d._id}>
              {`${index + 1}.`} {`${d.foodName[0].toUpperCase() + d.foodName.slice(1)}`} {d.quantity}
              {d.metrics}
              {editMode[d._id] ? (
                <>
                  <input
                    type="text"
                    placeholder="New food name...."
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  <button onClick={() => updateFood(d._id)}>Save</button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditMode({ ...editMode, [d._id]: true })}>Edit</button>
                  <button onClick={() => deleteFood(d._id)}>Delete</button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
