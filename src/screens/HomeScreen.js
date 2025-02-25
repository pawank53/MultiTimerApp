import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import React, { useState, useEffect , useMemo} from 'react';
import { TextInput, RadioButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { addTimer, updateTimer, resetTimer, removeTimer, addCompletedTimer } from '../redux/timerSlice';

const HomeScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [category, setCategory] = useState('');
    const [checked, setChecked] = useState("unchecked");
    const [percentage, setPercentage] = useState(0);
    const [collapsedCategories, setCollapsedCategories] = useState({});

    const dispatch = useDispatch();

    const data = useSelector((state) =>
        state.timer.activeTimers.filter(timer => timer.status !== "Completed") || []
    );

    const toggleCollapse = (category) => {
        setCollapsedCategories((prev) => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    useEffect(() => {
        if (!Array.isArray(data) || data.length === 0) return;

        const interval = setInterval(() => {
            data.forEach(timer => {
                if (timer.isRunning && timer.remainingTime > 0) {
                    dispatch(updateTimer({
                        id: timer.id,
                        remainingTime: timer.remainingTime - 1,
                        isRunning: true,
                        status: "RUNNING"
                    }));
                } else if (timer.isRunning && timer.remainingTime === 0) {
                    dispatch(removeTimer(timer.id));
                    moveToHistory(timer);
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [data, dispatch]);

    const moveToHistory = (completedTimer) => {
        addCompletedTimer(completedTimer);
    };

    const handleAddTimer = () => {
        if (!name || !duration || !category) {
            alert("Please fill all the fields");
            return;
        }

        const timerData = {
            id: Date.now().toString(),
            name,
            duration: parseInt(duration) > 0 ? parseInt(duration) : 0,
            remainingTime: parseInt(duration) > 0 ? parseInt(duration) : 0,
            category,
            isRunning: checked === 'checked',
            status: "PENDING",
        };

        dispatch(addTimer(timerData));
        setModalVisible(false);
        resetForm();
    };

    const resetForm = () => {
        setName('');
        setDuration('');
        setCategory('');
        setChecked("unchecked");
    };

    const handleStartPause = (timerId) => {
        const timer = data.find(timer => timer.id === timerId);
        if (timer && timer.remainingTime > 0 && timer.duration > 0) {
            dispatch(updateTimer({
                id: timerId,
                isRunning: !timer.isRunning,
                status: !timer.isRunning ? "RUNNING" : "PAUSED",
                remainingTime: timer.remainingTime
            }));
        }

    };
    const handleReset = (timerId) => {
        const timer = data.find(timer => timer.id === timerId);
        if (timer) {
            dispatch(resetTimer({ id: timerId }));
        }
    };

    const groupedData = useMemo(() => {
        return data.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});
    }, [data]);

    const handlePauseResumeAll = (category) => {
        const timers = groupedData[category] || [];
        const shouldPause = timers.every(timer => timer.isRunning);
    
        timers.forEach(timer => {
            dispatch(updateTimer({
                id: timer.id,
                isRunning: !shouldPause,
                remainingTime: timer.remainingTime, 
                status: shouldPause ? "PAUSED" : "RUNNING"
            }));
        });
    };
    
    
    const handleResetAll = (category) => {
        const timers = groupedData[category] || [];
    
        timers.forEach(timer => {
            dispatch(resetTimer({ id: timer.id }));
        });
    };
    

    const renderCategory = ({ item }) => {
        const isCollapsed = collapsedCategories[item.category] || false;
        const timers = groupedData[item.category] || [];
        const allRunning = timers.every(timer => timer.isRunning);
        const allPaused = timers.every(timer => !timer.isRunning);
        return(
        <View style={styles.categoryContainer}>
            <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{item.category}</Text>
                <TouchableOpacity onPress={() => toggleCollapse(item.category)} >
                    <Text>{collapsedCategories[item.category] ? "🔼" : "🔽"}</Text>
                </TouchableOpacity>
            </View>
            {!isCollapsed && groupedData[item.category]?.length > 0 && (
                <FlatList
                    data={groupedData[item.category] || []}
                    keyExtractor={(timer) => timer.id}
                    renderItem={renderItem}
                    
                />
            )}
             {!isCollapsed && (
                <View style={styles.categoryActions}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handlePauseResumeAll(item.category)}>
                        <Text>{allRunning ? "Pause All" : "Resume All"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleResetAll(item.category)}>
                        <Text>Reset All</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )};

    const renderItem = ({ item }) => {
        return(
        <View style={styles.card}>
            <View style={styles.timerHeading}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.percentage}>{Math.floor(((item.duration - item.remainingTime) / item.duration) * 100)}%</Text>
            </View>
            <Text>Duration: {item.remainingTime} seconds</Text>
            <View style={styles.btnContainer}>
                <TouchableOpacity onPress={() => handleStartPause(item.id)}>
                    <Text style={styles.cap}>{item.isRunning ? "Pause" : "Resume"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleReset(item.id)}>
                    <Text style={styles.cap}>Reset</Text>
                </TouchableOpacity>
            </View>
        </View>
    )};

    return (
        <View style={styles.container}>
            {Object.keys(groupedData).length > 0 ? (
                <FlatList
                    data={Object.keys(groupedData).map(category => ({ category }))}
                    keyExtractor={(item) => item.category}
                    renderItem={renderCategory}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text>No timers added yet</Text>
                </View>
            )}

            <TouchableOpacity style={styles.floatingBtn} onPress={() => setModalVisible(true)}>
                <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalItemContainer}>
                        <TextInput style={styles.txt} label="Name" value={name} mode="outlined" onChangeText={setName} />
                        <TextInput style={styles.txt} label="Duration (seconds)" value={duration} 
                        onChangeText={(text) => {
                            const numericText = text.replace(/[^0-9]/g, '');
                            setDuration(numericText);
                        }}
                        mode="outlined" keyboardType="numeric" />
                        <TextInput style={styles.txt} label="Category" value={category} mode="outlined" onChangeText={setCategory} />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ marginRight: 10 }}>Start Timer:</Text>
                            <RadioButton
                                value="checked"
                                status={checked}
                                onPress={() => setChecked(checked === "checked" ? "unchecked" : "checked")}
                            />
                        </View>
                        <View style={styles.btnContainer}>
                            <TouchableOpacity style={styles.actionBtn} onPress={() => {
                                setModalVisible(false);
                                resetForm();
                            }}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionBtn} onPress={handleAddTimer}>
                                <Text>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        backgroundColor: "#fff",
        borderRadius: 8,

    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    categoryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: "#fff", 
    },

    categoryActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 5,
    },
    actionBtn: {
        padding: 8,
        backgroundColor: "#007bff",
        borderRadius: 5,
        alignItems: "center",
    },
    actionBtnText: {
        color: "white",
        fontWeight: "bold",
    },
    card: {
        padding: 16,
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
    statusRunning: {
        color: '#4CAF50',
        fontSize: 12,
    },
    statusPaused: {
        color: '#FF9800',
        fontSize: 12,
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
    },
    cap: {
        textTransform: 'uppercase',
        color: '#2196F3',
        fontWeight: 'bold',
    },
    floatingBtn: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: '#2196F3',
        borderRadius: 30,
        elevation: 8,
    },
    btnText: {
        fontSize: 24,
        color: 'white',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    modalItemContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    txt: {
        marginBottom: 12,
    },
    actionBtn: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        minWidth: 80,
    },
    percentage: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007bff',
    },
});

export default HomeScreen;