import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  // LOAD DATA
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await AsyncStorage.getItem('tasks');
    if (data) setTasks(JSON.parse(data));
  };

  // SAVE DATA
  const saveTasks = async (data) => {
    setTasks(data);
    await AsyncStorage.setItem('tasks', JSON.stringify(data));
  };

  // CREATE or UPDATE
  const handleSave = () => {

    if (!subject || !description) return;

    if (editId) {
      // UPDATE
      const updated = tasks.map(item =>
        item.id === editId
          ? { ...item, subject, description, deadline }
          : item
      );

      saveTasks(updated);
      setEditId(null);

    } else {
      // CREATE
      const newTask = {
        id: Date.now().toString(),
        subject,
        description,
        deadline
      };

      saveTasks([...tasks, newTask]);
    }

    setSubject('');
    setDescription('');
    setDeadline('');
  };

  // DELETE
  const deleteTask = (id) => {
    const filtered = tasks.filter(item => item.id !== id);
    saveTasks(filtered);
  };

  // EDIT
  const editTask = (item) => {
    setSubject(item.subject);
    setDescription(item.description);
    setDeadline(item.deadline);
    setEditId(item.id);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Study Planner</Text>

      {/* INPUTS */}
      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
      />

      <TextInput
        style={styles.input}
        placeholder="Description / Topic"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Deadline (optional)"
        value={deadline}
        onChangeText={setDeadline}
      />

      {/* BUTTON */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {editId ? 'Update Task' : 'Add Task'}
        </Text>
      </TouchableOpacity>

      {/* LIST */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>

            <Text style={styles.subject}>{item.subject}</Text>
            <Text>{item.description}</Text>

            {item.deadline ? (
              <Text style={styles.deadline}>
                Deadline: {item.deadline}
              </Text>
            ) : null}

            <View style={styles.row}>

              <TouchableOpacity
                onPress={() => editTask(item)}
              >
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => deleteTask(item.id)}
              >
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>

            </View>

          </View>
        )}
      />

    </View>
  );
}

// STYLES
const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    marginTop: 50
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8
  },

  button: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20
  },

  buttonText: {
    fontWeight: 'bold'
  },

  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10
  },

  subject: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  deadline: {
    marginTop: 5,
    fontStyle: 'italic'
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },

  edit: {
    color: 'blue'
  },

  delete: {
    color: 'red'
  }

});