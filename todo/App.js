import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import Axios from 'axios';

const image = require('./assets/grocery.jpg');
const img = require('./assets/shopping-bag.png');

export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);

  useEffect(() => {
    Axios.get('https://back-xaov.onrender.com/read')
      .then((response) => {
        console.log(response.data);
        setTaskItems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  const handleAddTask = async () => {
    try {
      const response = await fetch('https://back-xaov.onrender.com/insert', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTaskItems(data);
        setTask('');
      } else {
        console.error('Failed to add task:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding task:', error.message);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`https://back-xaov.onrender.com/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        setTaskItems(data);
      } else {
        console.error('Failed to delete task:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  const completeTask = (index) => {
    // Add your logic for completing a task if needed
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.tasksWrapper}>
            <View style={styles.header}>
              <Text style={styles.sectionTitle}>Today's tasks</Text>
              <Image source={img} style={styles.taskImage} />
            </View>

            <View style={styles.items}>
              {taskItems.map((item, index) => (
                <View key={index} style={styles.taskContainer}>
                  <TouchableOpacity onPress={() => completeTask(index)}>
                    <Text style={styles.taskText}>{item.foodName}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteTask(item._id)}>
                    <Text style={styles.deleteButton}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.writeTaskWrapper}
        >
          <TextInput
            style={styles.input}
            placeholder={'Write a task'}
            value={task}
            onChangeText={(text) => setTask(text)}
          />
          <TouchableOpacity onPress={() => handleAddTask()}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  image: {
    flex: 1,  // Set flex to 1 to stretch the image to the top
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  tasksWrapper: {
    flex: 0,  // Set flex to 0 to prevent the tasksWrapper from taking additional space
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  taskText: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },
  addText: {},
  deleteButton: {
    color: 'red',
    marginLeft: 10,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskImage: {
    width: 30,
    height: 30,
    marginLeft: 10,
    borderRadius: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});
