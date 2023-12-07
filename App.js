import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const apiKey = 'eec4e385d4msh99bf0f51817ee3ep1bcee2jsn40de7eded71b'; //change your APIKey here

const TranslateApp = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Vietnamese', value: 'vi' },
    { label: 'French', value: 'fr' },
  ];

  const handleApiError = (error) => {
    console.error(error);
    if (error.response) {
      const status = error.response.status;
      if (status === 429) {
        Alert.alert('Error', 'Too many requests. Please try again later.');
      } else {
        Alert.alert('Error', `Server error: ${status}`);
      }
    } else if (error.request) {
      Alert.alert('Error', 'No response from the server. Please check your internet connection.');
    } else {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const translateText = async (inputLanguage) => {
    const encodedParams = new URLSearchParams();
    encodedParams.set('q', inputText);
    encodedParams.set('target', selectedLanguage);
    encodedParams.set('source', inputLanguage);

    const options = {
      method: 'POST',
      url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'application/gzip',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com',
        'useQueryString': true,
      },
      data: encodedParams,
    };

    try {
      const response = await axios.request(options);
      console.log(response.data.data.translations[0].translatedText);
      setOutputText(response.data.data.translations[0].translatedText);
    } catch (error) {
      handleApiError(error);
    }
  };

  const detectLanguageAndTranslate = async () => {
    if (inputText.trim() === '') {
      Alert.alert('Error', 'Please enter text to translate!');
      return;
    }

    const encodedParams = new URLSearchParams();
    encodedParams.set('q', inputText);

    const options = {
      method: 'POST',
      url: 'https://google-translate1.p.rapidapi.com/language/translate/v2/detect',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'application/gzip',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com',
        'useQueryString': true,
      },
      data: encodedParams,
    };

    try {
      const response = await axios.request(options);
      console.log(response.data.data.detections[0][0].language);
      const inputLanguage = response.data.data.detections[0][0].language;

     if (inputLanguage !== selectedLanguage){
        translateText(inputLanguage);
      } else {
        setOutputText(inputText);
      }

    } catch (error) {
      handleApiError(error);
      setOutputText('');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        style={{  height: 'auto',
                  borderColor: 'gray',
                  borderWidth: 1,
                  marginBottom: 10,
                  fontSize: 18, }}
        placeholder="Enter text to translate"
        multiline={true}
        numberOfLines={3}
        onChangeText={(text) => setInputText(text)}
        value={inputText}
        textAlignVertical="top"
      />

      <Picker
        selectedValue={selectedLanguage}
        onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
      >
        {languages.map((language) => (
          <Picker.Item key={language.value} label={language.label} value={language.value} />
        ))}
      </Picker>

      <Button title="Translate" onPress={detectLanguageAndTranslate} />

      <Text style={{  marginTop: 20,
                      fontWeight: 'bold',
                      fontSize: 18,
       }}>Translated Text:</Text>
      <Text style={{ fontSize:18 }}>{outputText}</Text>
    </View>
  );
};

export default TranslateApp;
