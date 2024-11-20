import { Image, SafeAreaView, StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import { Text } from "react-native";
import FormTextField from "./FormTextFields";
import { useState } from "react";
import { Button } from "react-native";
import { launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from '@expo/vector-icons'; // Importing icon library

const imgDir = FileSystem.documentDirectory + 'images/';

const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(imgDir);
    if(!dirInfo.exists){
        await FileSystem.makeDirectoryAsync(imgDir, {intermediates:true});
    }
};

function FormProjectGroup({ 
    idx,
    findingType, 
    date, 
    supervisor, 
    safetyOfficer, 
    findingDescription, 
    actionDescription, 
    status,
    setImage,
    onImageChange,
    onFindingTypeChange, 
    onDateChange, 
    onSupervisorChange, 
    onSafetyOfficerChange, 
    onFindingDescriptionChange, 
    onActionDescriptionChange, 
    onStatusChange, 
    onDelete,
    image,
    errors = {},
    ...rest  }) {

    const [showDatePicker, setShowDatePicker] = useState(false);

    const selectImage = async (useLibrary) => {
        let permissionResult;
        
        if (useLibrary) {
            permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        } else {
            permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        }

        if (!permissionResult.granted) {
            alert('Permission to access camera or media library is required!');
            return;
        }

        let result;
        if (useLibrary) {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1
            });
        } else {
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images
            });
        }

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            onImageChange(imageUri);  // Update the parent component with the image URI
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            onDateChange(selectedDate.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
        }
    };

    return (
        <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
                <TouchableOpacity style={styles.trashIcon} onPress={onDelete}>
                    <FontAwesome name="trash" size={20} color="#FF6347" />
                </TouchableOpacity>
                
                <FormTextField
                    label="Finding Type"
                    value={findingType}
                    onChangeText={onFindingTypeChange}
                    errorMessage={errors.findingType}
                />
                <View>
                    <Text>Date</Text>
                    <Button title={date ? date : "Select Date"} onPress={() => setShowDatePicker(true)} />
                    {showDatePicker && (
                        <DateTimePicker
                            value={date ? new Date(date) : new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                </View>
                <FormTextField
                    label="Supervisor / PIC"
                    value={supervisor}
                    onChangeText={onSupervisorChange}
                    errorMessage={errors.supervisor}
                />
                <FormTextField
                    label="Safety Officer"
                    value={safetyOfficer}
                    onChangeText={onSafetyOfficerChange}
                    errorMessage={errors.safetyOfficer}
                />
                <FormTextField
                    label="Finding Description"
                    value={findingDescription}
                    onChangeText={onFindingDescriptionChange}
                    errorMessage={errors.findingDescription}
                />
                <FormTextField
                    label="Action Description"
                    value={actionDescription}
                    onChangeText={onActionDescriptionChange}
                    errorMessage={errors.actionDescription}
                />
                <FormTextField
                    label="Status"
                    value={status}
                    onChangeText={onStatusChange}
                    errorMessage={errors.status}
                />
                <Button title="Photo Library" onPress={() => selectImage(true)} />
                <Button title="Capture Image" onPress={() => selectImage(false)} />
                {image && <Image source={{ uri: image }} style={styles.image} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        padding: 5,
    },
    innerContainer: {
        padding: 16,
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 8,
        backgroundColor: "#ffffff",
        position: "relative", // Required for absolute positioning of the trash icon
    },
    trashIcon: {
        position: "absolute",
        bottom: 10,
        right: 10,
        zIndex: 1,
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#cbd5e1",
    }
});

export default FormProjectGroup;
