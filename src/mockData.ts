import { LogEntry } from './types';

export const mockLogs: LogEntry[] = [
  {
    "id": "NwyTjVsuz6H3VYiWzpIM",
    "timestamp": "2025-03-04T13:12:58.976Z",
    "level": 20,
    "levelName": "debug",
    "message": "sent ack",
    "data": {
      "recv": {
        "tag": "receipt",
        "attrs": {
          "from": "46761305858@s.whatsapp.net",
          "type": "played-self",
          "id": "3A97D1368C4DB5D1068A",
          "recipient": "48884790665@s.whatsapp.net",
          "t": "1741093978"
        }
      },
      "sent": {
        "id": "3A97D1368C4DB5D1068A",
        "to": "46761305858@s.whatsapp.net",
        "class": "receipt",
        "recipient": "48884790665@s.whatsapp.net",
        "type": "played-self"
      }
    }
  },
  {
    "id": "j6Qe5r79bh3ePYGJS6Cu",
    "timestamp": "2025-03-04T13:12:33.597Z",
    "level": 20,
    "levelName": "debug",
    "message": "Message processing completed",
    "data": {
      "messageId": "3A97D1368C4DB5D1068A",
      "duration": 3035
    }
  },
  {
    "id": "wyKXarmJzVxbCz0BiQFg",
    "timestamp": "2025-03-04T13:12:32.896Z",
    "level": 20,
    "levelName": "debug",
    "message": "Temporary audio file deleted",
    "data": {
      "filePath": "/home/dolan/ace-whatsapp-store/dist/.temp/3A97D1368C4DB5D1068A.oga"
    }
  },
  {
    "id": "izp43BtzzVRTIU7piQgU",
    "timestamp": "2025-03-04T13:12:32.896Z",
    "level": 20,
    "levelName": "debug",
    "message": "Audio transcription completed successfully",
    "data": {
      "processingTime": 1911
    }
  },
  {
    "id": "IR7Hll05ORSkDoioxZQV",
    "timestamp": "2025-03-04T13:12:32.896Z",
    "level": 20,
    "levelName": "debug",
    "message": "Media processing completed",
    "data": {
      "messageId": "3A97D1368C4DB5D1068A",
      "messageType": "audioMessage",
      "duration": 2334
    }
  },
  {
    "id": "8RJBPfFo5ShhyKT8d5qt",
    "timestamp": "2025-03-04T13:12:32.848Z",
    "level": 20,
    "levelName": "debug",
    "message": "sent ack",
    "data": {
      "recv": {
        "tag": "receipt",
        "attrs": {
          "from": "46761305858@s.whatsapp.net",
          "type": "played-self",
          "id": "3AFDFDA78A5EA637F033",
          "recipient": "48884790665@s.whatsapp.net",
          "t": "1741093952"
        }
      },
      "sent": {
        "id": "3AFDFDA78A5EA637F033",
        "to": "46761305858@s.whatsapp.net",
        "class": "receipt",
        "recipient": "48884790665@s.whatsapp.net",
        "type": "played-self"
      }
    }
  },
  {
    "id": "Bpg075OeC0qWYsM1xZeH",
    "timestamp": "2025-03-04T13:12:31.460Z",
    "level": 20,
    "levelName": "debug",
    "message": "sent ack",
    "data": {
      "recv": {
        "tag": "receipt",
        "attrs": {
          "from": "46761305858:16@s.whatsapp.net",
          "type": "read-self",
          "id": "3AC1F3354A6A300812A3",
          "recipient": "48884790665@s.whatsapp.net",
          "t": "1741093951"
        }
      },
      "sent": {
        "id": "3AC1F3354A6A300812A3",
        "to": "46761305858:16@s.whatsapp.net",
        "class": "receipt",
        "recipient": "48884790665@s.whatsapp.net",
        "type": "read-self"
      }
    }
  },
  {
    "id": "EKLzP0PWqWTVCxZ1xGH8",
    "timestamp": "2025-03-04T13:12:31.446Z",
    "level": 20,
    "levelName": "debug",
    "message": "sent ack",
    "data": {
      "recv": {
        "tag": "receipt",
        "attrs": {
          "from": "46761305858:16@s.whatsapp.net",
          "type": "read-self",
          "id": "3A87551217373BD658B2",
          "recipient": "48884790665@s.whatsapp.net",
          "t": "1741093951"
        }
      },
      "sent": {
        "id": "3A87551217373BD658B2",
        "to": "46761305858:16@s.whatsapp.net",
        "class": "receipt",
        "recipient": "48884790665@s.whatsapp.net",
        "type": "read-self"
      }
    }
  },
  {
    "id": "oMkTGLbcE1jaognRCFIB",
    "timestamp": "2025-03-04T13:12:31.442Z",
    "level": 20,
    "levelName": "debug",
    "message": "sent ack",
    "data": {
      "recv": {
        "tag": "receipt",
        "attrs": {
          "from": "46761305858@s.whatsapp.net",
          "type": "read-self",
          "id": "3AFDFDA78A5EA637F033",
          "recipient": "48884790665@s.whatsapp.net",
          "t": "1741093951"
        }
      },
      "sent": {
        "id": "3AFDFDA78A5EA637F033",
        "to": "46761305858@s.whatsapp.net",
        "class": "receipt",
        "recipient": "48884790665@s.whatsapp.net",
        "type": "read-self"
      }
    }
  },
  {
    "id": "mGwKNQICtsYt47bFxo2s",
    "timestamp": "2025-03-04T13:12:30.985Z",
    "level": 20,
    "levelName": "debug",
    "message": "Transcribing audio",
    "data": {
      "filePath": "/home/dolan/ace-whatsapp-store/dist/.temp/3A97D1368C4DB5D1068A.oga"
    }
  },
  {
    "id": "Wu9VTnB0Mv8EWzncfTZQ",
    "timestamp": "2025-03-04T13:12:30.985Z",
    "level": 20,
    "levelName": "debug",
    "message": "Processing audio with AI",
    "data": {
      "messageId": "3A97D1368C4DB5D1068A"
    }
  },
  {
    "id": "GS9VWEClvRwuA04hbNuz",
    "timestamp": "2025-03-04T13:12:30.985Z",
    "level": 20,
    "levelName": "debug",
    "message": "Media uploaded to storage",
    "data": {
      "messageId": "3A97D1368C4DB5D1068A",
      "bucketFilename": "48884790665@s.whatsapp.net/3A97D1368C4DB5D1068A.oga"
    }
  },
  {
    "id": "5ZGVr2A2kIyc5KZVUcoX",
    "timestamp": "2025-03-04T13:12:30.962Z",
    "level": 20,
    "levelName": "debug",
    "message": "sent ack",
    "data": {
      "recv": {
        "tag": "receipt",
        "attrs": {
          "from": "46761305858@s.whatsapp.net",
          "type": "read-self",
          "id": "3A97D1368C4DB5D1068A",
          "recipient": "48884790665@s.whatsapp.net",
          "t": "1741093950"
        }
      },
      "sent": {
        "id": "3A97D1368C4DB5D1068A",
        "to": "46761305858@s.whatsapp.net",
        "class": "receipt",
        "recipient": "48884790665@s.whatsapp.net",
        "type": "read-self"
      }
    }
  },
  {
    "id": "Fh9avTmnaS0jkS9UXAw2",
    "timestamp": "2025-03-04T13:12:30.844Z",
    "level": 20,
    "levelName": "debug",
    "message": "Media saved to temp file",
    "data": {
      "messageId": "3A97D1368C4DB5D1068A",
      "tempFilePath": "/home/dolan/ace-whatsapp-store/dist/.temp/3A97D1368C4DB5D1068A.oga"
    }
  },
  {
    "id": "v04LAvI0Z2TnTmHt8r26",
    "timestamp": "2025-03-04T13:12:30.562Z",
    "level": 30,
    "levelName": "info",
    "message": "Processing message",
    "data": {
      "jid": "48884790665@s.whatsapp.net",
      "messageId": "3A97D1368C4DB5D1068A",
      "fromMe": false,
      "pushName": "Monika Adamin",
      "timestamp": 1741093950
    }
  },
  {
    "id": "MBqS0MCE7fPirlabTxN1",
    "timestamp": "2025-03-04T13:12:30.562Z",
    "level": 20,
    "levelName": "debug",
    "message": "Processing media message",
    "data": {
      "messageId": "3A97D1368C4DB5D1068A",
      "messageType": "audioMessage"
    }
  },
  {
    "id": "EBoJ2u9Wy3S4pgkUQzqk",
    "timestamp": "2025-03-04T13:12:30.562Z",
    "level": 20,
    "levelName": "debug",
    "message": "Messages received",
    "data": {
      "count": 1,
      "type": "notify"
    }
  },
  {
    "id": "6FtfOGqWlEz6kFNC4PNN",
    "timestamp": "2025-03-04T13:12:30.562Z",
    "level": 20,
    "levelName": "debug",
    "message": "Downloading media",
    "data": {
      "messageId": "3A97D1368C4DB5D1068A",
      "messageType": "audioMessage"
    }
  },
  {
    "id": "VFewaRKpk7NRuz5kXOoD",
    "timestamp": "2025-03-04T13:12:30.560Z",
    "level": 20,
    "levelName": "debug",
    "message": "sent ack",
    "data": {
      "recv": {
        "tag": "message",
        "attrs": {
          "from": "48884790665@s.whatsapp.net",
          "type": "media",
          "id": "3A97D1368C4DB5D1068A",
          "notify": "Monika Adamin",
          "sender_lid": "1907217191123@lid",
          "t": "1741093950"
        }
      },
      "sent": {
        "id": "3A97D1368C4DB5D1068A",
        "to": "48884790665@s.whatsapp.net",
        "class": "message",
        "type": "media"
      }
    }
  },
  {
    "id": "q4SONHtVPpXPkDelAFpM",
    "timestamp": "2025-03-04T13:12:30.559Z",
    "level": 20,
    "levelName": "debug",
    "message": "sending receipt for messages",
    "data": {
      "attrs": {
        "id": "3A97D1368C4DB5D1068A",
        "to": "48884790665@s.whatsapp.net",
        "type": "inactive"
      },
      "messageIds": [
        "3A97D1368C4DB5D1068A"
      ]
    }
  },
  {
    "id": "x0xFPbb8QjNg6Gj0VmGF",
    "timestamp": "2025-03-04T13:12:23.050Z",
    "level": 20,
    "levelName": "debug",
    "message": "Message processing completed",
    "data": {
      "messageId": "3A87551217373BD658B2",
      "duration": 818
    }
  },
  {
    "id": "0PocOtUcIMdmEh78VNTZ",
    "timestamp": "2025-03-04T13:12:22.935Z",
    "level": 20,
    "levelName": "debug",
    "message": "Message processing completed",
    "data": {
      "messageId": "3AFDFDA78A5EA637F033",
      "duration": 2744
    }
  }
];