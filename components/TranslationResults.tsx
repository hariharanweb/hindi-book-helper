import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import RNFS from 'react-native-fs';
import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TranslationItem {
  eng: string;
  hin: string;
}

interface TranslationResultsProps {
  results: TranslationItem[];
}

export default function TranslationResults({ results }: TranslationResultsProps) {
  if (!results || results.length === 0) {
    return null;
  }

  const formatText = () => {
    return results
      .map((item, index) => `${item.eng}\n${item.hin}`)
      .join("\n\n");
  };

  const handleShare = async () => {
    try {
      const text = formatText();
      await Share.share({
        message: text,
      });
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Error", "Failed to share content");
    }
  };

  const handleCopy = async () => {
    try {
      const text = formatText();
      await Clipboard.setStringAsync(text);
      Alert.alert("Success", "Content copied to clipboard!");
    } catch (error) {
      console.error("Error copying:", error);
      Alert.alert("Error", "Failed to copy content");
    }
  };

  const handleSave = async () => {
    try {
      const jsonContent = JSON.stringify(results, null, 2);
      const fileName = `translations_${Date.now()}.json`;
      const fileUri = `${RNFS.CachesDirectoryPath}/${fileName}`;

      // Write file using react-native-fs
      await RNFS.writeFile(fileUri, jsonContent, 'utf8');

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Save Translation Output',
          UTI: 'public.json',
        });
      } else {
        Alert.alert("Success", "File created successfully");
      }
    } catch (error) {
      console.error("Error saving file:", error);
      Alert.alert("Error", "Failed to save file");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
          <Text style={styles.buttonText}>Copy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Output</Text>
        </TouchableOpacity>
      </View>

      {results.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <View style={styles.englishRow}>
            <Text style={styles.englishText}>{item.eng}</Text>
          </View>
          <View style={styles.hindiRow}>
            <Text style={styles.hindiText}>{item.hin}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  shareButton: {
    flex: 1,
    backgroundColor: "#34C759",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  copyButton: {
    flex: 1,
    backgroundColor: "#5856D6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#FF9500",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  itemContainer: {
    marginBottom: 0,
  },
  englishRow: {
    backgroundColor: "#2C3E50",
    padding: 16,
    width: "100%",
  },
  englishText: {
    color: "white",
    fontSize: 16,
    lineHeight: 24,
  },
  hindiRow: {
    backgroundColor: "#ECF0F1",
    padding: 16,
    width: "100%",
  },
  hindiText: {
    color: "#2C3E50",
    fontSize: 18,
    lineHeight: 28,
  },
});
