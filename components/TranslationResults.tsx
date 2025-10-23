import { StyleSheet, Text, View } from "react-native";

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

  return (
    <View style={styles.container}>
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
