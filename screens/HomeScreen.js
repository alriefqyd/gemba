import React, { useContext, useLayoutEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet, Modal } from "react-native";
import AuthContext from "../context/AuthContext";
import { logout } from "../services/AuthService";

export default function FieldReportScreen({ navigation }) {
    const { user, setUser } = useContext(AuthContext);
    const [showLogout, setShowLogout] = useState(false); // State to control modal visibility

    async function handleLogout() {
        await logout();
        setUser(null);
    }

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>SIGEMOY</Text>
                    <TouchableOpacity onPress={() => setShowLogout(true)}>
                        <Text>{user.name}</Text>
                        {/* <Image source={require('../assets/setting-icon.png')} style={styles.settingsIcon} /> */}
                    </TouchableOpacity>
                </View>

                {/* Modal for Logout Button */}
                <Modal
                    visible={showLogout}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowLogout(false)}
                >
                    <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowLogout(false)}>
                        <View style={styles.logoutContainer}>
                            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                                <Text style={styles.logoutButtonText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Welcome Section with Background Image */}
                <ImageBackground 
                    source={require('../assets/background.png')} // replace with your background image path
                    style={styles.welcomeBackground}
                    imageStyle={styles.welcomeBackgroundInner}
                >
                    <Text style={styles.welcomeTitle}>Welcome to SIGEMOY</Text>
                    <Text style={styles.welcomeSubtitle}>Submit your findings in the field.</Text>
                </ImageBackground>

                {/* Statistics Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statTitle}>Total Reports</Text>
                        <Text style={styles.statValue}>15</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statTitle}>Finding Open</Text>
                        <Text style={styles.statValue}>10</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statTitle}>Finding Close</Text>
                        <Text style={styles.statValue}>5</Text>
                    </View>
                </View>

                {/* New Report Button */}
                {/* <TouchableOpacity style={styles.newReportButton} onPress={() => navigation.navigate('Add Project')}>
                    <Text style={styles.newReportButtonText}>+ New report</Text>
                </TouchableOpacity> */}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
                    <Text style={styles.bottomNavText}>Reports</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Text style={styles.bottomNavText}>Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        paddingBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    settingsIcon: {
        width: 24,
        height: 24,
    },
    welcomeBackground: {
        width: '100%',
        height: 280,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    welcomeBackgroundInner: {
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    welcomeTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ecb220',
        textAlign: 'center',
    },
    welcomeSubtitle: {
        fontSize: 14,
        fontWeight:'bold',
        color: '#ecb220',
        textAlign: 'center',
        marginTop: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 16,
        paddingHorizontal: 10,
    },
    statCard: {
        backgroundColor: '#e0f7fa',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '30%',
    },
    statTitle: {
        fontSize: 16,
        color: '#333',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00796b',
        marginTop: 4,
    },
    newReportButton: {
        backgroundColor: '#00796b',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        margin: 16,
    },
    newReportButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    bottomNavText: {
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
    logoutButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
