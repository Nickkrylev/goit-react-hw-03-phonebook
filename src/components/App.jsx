import { nanoid } from 'nanoid';
import { Component } from 'react';
import { Div, Title } from './App.styled';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidUpdate(prevProps, prevState) {
    const { contacts } = this.state;
    if (contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }
  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);

    if (parsedContacts) {
      this.setState({contacts: parsedContacts}); 
    }
  }

  onContactFormSubmit = (newContact, { resetForm }) => {
    const { contacts } = this.state;
    const alreadyExist = contacts.find(contact => contact.name.toLowerCase() === newContact.name.toLowerCase());

    if (alreadyExist) {
      resetForm();
      return alert(`${newContact.name} is already in contacts`);
    }

    const contact = { id: nanoid(), ...newContact };

    this.setState(prevState => ({
      contacts: [...prevState.contacts, contact],
    }));
    resetForm();
  }

  FilterContacts = (e) => {
    this.setState({
      filter: e.target.value,
    });
  }

  onDeleteContact = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== id),
    }))
  }

  render() {
    const { contacts, filter } = this.state;
    const normalizedFiler = filter.toLowerCase();
    const filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(normalizedFiler));
    return (
      <Div>
        <Title>Phonebook</Title>
        <ContactForm onContactFormSubmit={this.onContactFormSubmit} />

        <h2>Contacts</h2>
        <Filter filter={filter} OnChange={this.FilterContacts} />

        <ContactList
          contacts={filteredContacts}
          onDeleteContact={this.onDeleteContact}
        />
      </Div>
    );
  }
}

