import { useState } from 'react';

export const useUserManagement = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'employee',
    password: '',
    confirmPassword: ''
  });

  const handleEditProfile = (currentUser) => {
    setEditingProfile({
      name: currentUser.name,
      email: currentUser.email,
      password: '',
      confirmPassword: ''
    });
    setShowEditProfile(true);
  };

  const handleSaveProfile = (currentUser, setCurrentUser, showNotification) => {
    if (editingProfile.password !== editingProfile.confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }

    // Update the current user
    const updatedUser = {
      ...currentUser,
      name: editingProfile.name,
      email: editingProfile.email
    };

    if (editingProfile.password) {
      updatedUser.password = editingProfile.password;
    }

    setCurrentUser(updatedUser);
    setShowEditProfile(false);
    showNotification('Profile updated successfully!', 'success');
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowEditUser(true);
  };

  const handleSaveUser = (showNotification) => {
    if (editingUser.password !== editingUser.confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }

    // Update the user
    const updatedUser = {
      ...editingUser,
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role
    };

    if (editingUser.password) {
      updatedUser.password = editingUser.password;
    }

    setEditingUser(updatedUser);
    setShowEditUser(false);
    showNotification('User updated successfully!', 'success');
  };

  const handleAddUser = (setEmployees, showNotification) => {
    if (newUser.password !== newUser.confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }

    // Add the new user
    const newUserToAdd = {
      ...newUser,
      id: Date.now(),
      avatar: 'U' // You might want to generate a unique avatar for each user
    };

    setEmployees(prev => [...prev, newUserToAdd]);
    setNewUser({
      name: '',
      email: '',
      role: 'employee',
      password: '',
      confirmPassword: ''
    });
    setShowAddUser(false);
    showNotification('User added successfully!', 'success');
  };

  return {
    // State
    showEditProfile,
    setShowEditProfile,
    editingProfile,
    setEditingProfile,
    showEditUser,
    setShowEditUser,
    editingUser,
    setEditingUser,
    showAddUser,
    setShowAddUser,
    newUser,
    setNewUser,
    
    // Actions
    handleEditProfile,
    handleSaveProfile,
    handleEditUser,
    handleSaveUser,
    handleAddUser
  };
};
