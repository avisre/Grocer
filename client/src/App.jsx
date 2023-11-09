import React, { useState, useEffect } from 'react';
import grocer from '../Assets/shopping-bag.png'
import Axios from 'axios';
import './index.css';

function App() {
  const [count, setCount] = useState('');
  const [name, setName] = useState('');
  const [metric, setMetric] = useState('');
  const [num, setNum] = useState(0);
  const [list, setList] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [editQuantity, setEditQuantity] = useState(0);
  const [editMetric, setEditMetric] = useState('');

  useEffect(() => {
    Axios.get('https://cyan-mushy-panther.cyclic.app/read').then((response) => {
      setList(response.data);
    });
  }, []);

  const add = async () => {
    await Axios.post('https://cyan-mushy-panther.cyclic.app/insert', {
      count: count,
      num: num,
      metric: metric
    });
    const response = await Axios.get('https://cyan-mushy-panther.cyclic.app/read');
    setList(response.data);
    setCount('');
    setNum(0);
    setMetric('');
  };

  const updateFood = async (id) => {
    try {
      await Axios.put('https://cyan-mushy-panther.cyclic.app/update', {
        id: id,
        name: name,
        quantity: editQuantity,
        metric: editMetric
      });
      const response = await Axios.get('https://cyan-mushy-panther.cyclic.app/read');
      setList(response.data);
      setEditMode({ ...editMode, [id]: false });
      setName('');
      setEditQuantity(0);
      setEditMetric('');
    } catch (error) {
      console.error('Error updating food:', error);
    }
  };

  const deleteFood = async (id) => {
    try {
      await Axios.delete(`https://cyan-mushy-panther.cyclic.app/delete/${id}`);
      const response = await Axios.get('https://cyan-mushy-panther.cyclic.app/read');
      setList(response.data);
    } catch (error) {
      console.error('Error deleting food:', error);
    }
  };

  return (
    <>
      <div className='Header'>
        <h1>Grocers</h1><img src={grocer} alt='Grocery icon' />
      </div>
      <div className="App">
        <label htmlFor="name">Enter Food Item</label>
        <input
          type="text"
          id="name"
          value={count}
          placeholder='Foodstuff'
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
        <h2>Grocery List</h2>
        {list.map((d, index) => {
          return (
            <div className='Item' key={d._id}>
              {`${index + 1}.`} {`${d.foodName[0].toUpperCase() + d.foodName.slice(1)}-`}
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
                  <input
                    type="number"
                    placeholder="Quantity..."
                    value={editQuantity}
                    onChange={(e) => {
                      setEditQuantity(e.target.value);
                    }}
                  />
                  <select
                    className='sm'
                    name="pets"
                    value={editMetric}
                    onChange={(e) => {
                      setEditMetric(e.target.value);
                    }}
                  >
                    <option value=''>Select</option>
                    <option value="Kg">Kg</option>
                    <option value="L">L</option>
                    <option value="Nos">Nos</option>
                  </select>
                  <button onClick={() => updateFood(d._id)}>Save</button>
                </>
              ) : (
                <>
                  {d.quantity} {d.metrics}
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
