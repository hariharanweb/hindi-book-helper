import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { translateHindi } from '../services/openAi';
import TranslationResults from '../components/TranslationResults';

interface TranslationItem {
  eng: string;
  hin: string;
}

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [translationResults, setTranslationResults] = useState<TranslationItem[]>([]);

  const handleUpload = async () => {
    if (!selectedImage) return;

    try {
      setIsUploading(true);
      const response = await translateHindi(selectedImage.base64);
      setTranslationResults(response);
      Alert.alert("Success", "Translation completed successfully!");
      console.log("Upload response:", response);
    } catch (error) {
      Alert.alert("Error", "Failed to translate image. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: false,
      quality: 1,
      base64: true
    });

    if (!result.canceled) {
      console.log("Selected image:", result.assets[0].uri);
      setSelectedImage(result.assets[0]);
    }
  };

  const captureImage = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera permissions to take photos!"
      );
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
      base64: true,
      allowsEditing: false
    });

    if (!result.canceled) {
      console.log("Captured image:", result.assets[0].uri);
      setSelectedImage(result.assets[0]);
    }
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      {translationResults.length === 0 ? (
        <View style={styles.centerContent}>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.thumbnail}
            />
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={pickImage}
          >
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={captureImage}
          >
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>

          {selectedImage && (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleUpload}
              disabled={isUploading}
            >
              <Text style={styles.buttonText}>
                {isUploading ? "Uploading..." : "Upload"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          <TouchableOpacity
            style={styles.newButton}
            onPress={() => {
              setTranslationResults([]);
              setSelectedImage(null);
            }}
          >
            <Text style={styles.buttonText}>New Translation</Text>
          </TouchableOpacity>
          <TranslationResults results={translationResults} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 20,
  },
  resultsContainer: {
    flex: 1,
    paddingTop: 20,
  },
  thumbnail: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
  },
  uploadButton: {
    backgroundColor: "#34C759",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
  },
  newButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});