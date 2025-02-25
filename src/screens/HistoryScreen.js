import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

const HistoryScreen = () => {
    const completedData = useSelector((state) => state.timer.completedTimers || []);

    const groupedCompletedData = completedData.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    const renderCategory = ({ item }) => (
        <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{item.category}</Text>
            <FlatList
                data={groupedCompletedData[item.category]}
                keyExtractor={(timer) => timer.id}
                renderItem={renderItem}
            />
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.timerHeading}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.statusCompleted}>{item.status}</Text>
            </View>
            <Text>Duration: {item.duration} seconds</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {Object.keys(groupedCompletedData).length > 0 ? (
                <FlatList
                    data={Object.keys(groupedCompletedData).map(category => ({ category }))}
                    keyExtractor={(item) => item.category}
                    renderItem={renderCategory}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text>No completed timers yet</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryContainer: {
        marginBottom: 16,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        // elevation: 2,
    },
    timerHeading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusCompleted: {
        color: 'green',
        fontWeight: 'bold',
    },
});

export default HistoryScreen;
