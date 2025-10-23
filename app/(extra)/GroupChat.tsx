import { useRoute } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    Keyboard,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker' // ✅ Expo image picker
import { io, Socket } from 'socket.io-client'
import { BACKENDURL } from '../../config/config'

interface Message {
    user: string
    text?: string
    image?: string // ✅ added image support
    time?: string
}

interface RouteParams {
    username?: string
}

export default function ChatScreen() {
    const route = useRoute()
    const params = route.params as RouteParams

    const [socket, setSocket] = useState<Socket | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState<string>('')
    const [keyboardHeight, setKeyboardHeight] = useState(0)

    const [username] = useState<string>(
        params?.username || 'User_' + Math.floor(Math.random() * 1000)
    )
    const [room] = useState<string>('general')

    const flatListRef = useRef<FlatList<Message>>(null)

    // ✅ Keyboard listeners
    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', (e) =>
            setKeyboardHeight(e.endCoordinates.height)
        )
        const hide = Keyboard.addListener('keyboardDidHide', () =>
            setKeyboardHeight(0)
        )
        return () => {
            show.remove()
            hide.remove()
        }
    }, [])

    useEffect(() => {
        const s: Socket = io(BACKENDURL, {
            transports: ['websocket'],
            reconnection: true,
        })

        s.on('connect', () => {
            console.log('✅ Connected:', s.id)
            s.emit('joinRoom', { username, room })
        })

        s.on('message', (msg: Message) => setMessages((prev) => [...prev, msg]))

        setSocket(s)

        return () => {
            s.disconnect()
            return undefined
        }
    }, [])

    // ✅ Scroll on message
    useEffect(() => {
        if (messages.length > 0)
            setTimeout(
                () => flatListRef.current?.scrollToEnd({ animated: true }),
                100
            )
    }, [messages])

    const sendMessage = () => {
        if (!socket) return
        if (input.trim()) {
            socket.emit('sendMessage', { room, message: input, username })
            setInput('')
        }
    }

    const renderMessage = ({ item }: { item: Message }) => {
        const isOwn = item.user === username
        return (
            <View
                style={[
                    styles.messageContainer,
                    isOwn ? styles.myMessage : styles.otherMessage,
                ]}
            >
                {!isOwn && <Text style={styles.sender}>{item.user}</Text>}

                {/* ✅ Text or Image */}
                {item.image ? (
                    <Image
                        source={{ uri: item.image }}
                        style={{
                            width: 200,
                            height: 200,
                            borderRadius: 10,
                            marginBottom: 5,
                        }}
                        resizeMode="cover"
                    />
                ) : (
                    <Text style={styles.messageText}>{item.text}</Text>
                )}

                <Text style={styles.timeText}>
                    {new Date(item.time || new Date()).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#075E54" />
            <View style={styles.header}>
                <Text style={styles.headerText}>📱 {room} Group</Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(_, i) => i.toString()}
                renderItem={renderMessage}
                contentContainerStyle={styles.chatArea}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <View
                    style={[
                        styles.inputContainer,
                        Platform.OS === 'android' && {
                            marginBottom: keyboardHeight,
                        },
                    ]}
                >
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a message"
                            value={input}
                            onChangeText={setInput}
                            multiline
                        />
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            !input.trim() && styles.sendButtonDisabled,
                        ]}
                        onPress={sendMessage}
                        disabled={!input.trim()}
                    >
                        <Text style={styles.sendIcon}>➤</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ECE5DD' },
    header: {
        padding: 15,
        backgroundColor: '#075E54',
        alignItems: 'center',
    },
    headerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    chatArea: { flexGrow: 1, padding: 10 },
    messageContainer: {
        maxWidth: '80%',
        marginVertical: 5,
        padding: 10,
        borderRadius: 8,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
    },
    sender: {
        fontSize: 12,
        color: '#075E54',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    messageText: { color: '#000', fontSize: 16 },
    timeText: {
        fontSize: 10,
        color: '#777',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#F0F0F0',
        borderTopWidth: 1,
        borderColor: '#D1D1D1',
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 8,
    },
    input: { fontSize: 16, color: '#000', maxHeight: 100 },
    sendButton: {
        backgroundColor: '#075E54',
        width: 45,
        height: 45,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: { backgroundColor: '#A0A0A0', opacity: 0.5 },
    sendIcon: {
        color: '#fff',
        fontSize: 20,
        transform: [{ rotate: '-15deg' }],
    },
    galleryButton: {
        backgroundColor: '#fff',
        width: 45,
        height: 45,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    galleryIcon: { fontSize: 22 },
})
