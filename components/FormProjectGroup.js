import { SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import { Text } from "react-native";
import FormTextField from "./FormTextFields";
import { useState } from "react";
import { Button } from "react-native";

function FormProjectGroup({ 
    findingType, 
    date, 
    supervisor, 
    safetyOfficer, 
    findingDescription, 
    actionDescription, 
    status, 
    onFindingTypeChange, 
    onDateChange, 
    onSupervisorChange, 
    onSafetyOfficerChange, 
    onFindingDescriptionChange, 
    onActionDescriptionChange, 
    onStatusChange, 
    onDelete,
    errors = {},
    ...rest  }) {


    return (
        <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
                <FormTextField
                    label="Finding Type"
                    value={findingType}
                    onChangeText={(e) => onFindingTypeChange(e)}
                    errorMessage={errors.findingType}  // Match the backend field name
                />
                <FormTextField
                    label="Date"
                    value={date}
                    onChangeText={(e) => onDateChange(e)}
                    errorMessage={errors.date}  // Match the backend field name
                />
                <FormTextField
                    label="Supervisor / PIC"
                    value={supervisor}
                    onChangeText={(e) => onSupervisorChange(e)}
                    errorMessage={errors.supervisor}  // Match the backend field name
                />
                <FormTextField
                    label="Safety Officer"
                    value={safetyOfficer}
                    onChangeText={(e) => onSafetyOfficerChange(e)}
                    errorMessage={errors.safetyOfficer}  // Match the backend field name
                />
                <FormTextField
                    label="Finding Description"
                    value={findingDescription}
                    onChangeText={(e) => onFindingDescriptionChange(e)}
                    errorMessage={errors.findingDescription}  // Match the backend field name
                />
                <FormTextField
                    label="Action Description"
                    value={actionDescription}
                    onChangeText={(e) => onActionDescriptionChange(e)}
                    errorMessage={errors.actionDescription}  // Match the backend field name
                />
                <FormTextField
                    label="Status"
                    value={status}
                    onChangeText={(e) => onStatusChange(e)}
                    errorMessage={errors.status}  // Match the backend field name
                />
                <FormTextField
                    label="Finding Picture"
                    value=""
                    // onChangeText={(e) => setProjectStatus(e)}
                    errorMessage={errors.status}  // Match the backend field name
                />
            </View>
            <Button title="Delete Finding" onPress={onDelete} />
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        color: "#334155",
        fontWeight: '500'
    },
    textInput: {
        backgroundColor: "#f1f5f9",
        height: 40,
        marginTop: 4,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "#cbd5e1",
        padding: 10
    },
    error: {
        color: "red",
        marginTop: 2
    },
    outerContainer: {
        padding: 20,
    },
    innerContainer: {
        padding: 16,
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 8,
        backgroundColor: "#ffffff", // Optional: To give the container a background color
        rowGap: 16
    }
});

export default FormProjectGroup;
