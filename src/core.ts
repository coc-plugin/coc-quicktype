import { quicktype, InputData, jsonInputForTargetLanguage } from 'quicktype-core';
export type LanguageMap = {
  readonly python: 'py';
  readonly typescript: 'ts';
  readonly java: 'java';
  readonly go: 'go';
  readonly swift: 'swift';
  readonly dart: 'dart';
  readonly cpp: 'cpp';
  readonly javascript: 'js';
  readonly php: 'php';
  readonly rust: 'rs';
  readonly cs: 'cs';
  readonly elm: 'elm';
};
export class QuicktypeGenerator {
  static languageMap: LanguageMap = {
    python: 'py',
    typescript: 'ts',
    java: 'java',
    go: 'go',
    swift: 'swift',
    dart: 'dart',
    cpp: 'cpp',
    javascript: 'js',
    php: 'php',
    rust: 'rs',
    cs: 'cs',
    elm: 'elm',
  };
  static isAdvanced(language: keyof typeof QuicktypeGenerator.languageMap): boolean {
    const advanceds: (keyof typeof QuicktypeGenerator.languageMap)[] = [
      'php',
      'rust',
      'cs',
      'elm',
      'javascript',
    ];
    return advanceds.includes(language);
  }
  static async generate(
    jsonText: string,
    typeName: string,
    language: keyof typeof QuicktypeGenerator.languageMap,
    advanced: boolean = false
  ): Promise<string> {
    const targetLanguage = this.languageMap[language];
    if (!targetLanguage) {
      throw new Error(` ${language} Language not supported`);
    }
    const justTypes = !advanced;
    try {
      const jsonInput = jsonInputForTargetLanguage(targetLanguage);
      await jsonInput.addSource({
        name: typeName,
        samples: [jsonText],
      });
      const inputData = new InputData();
      inputData.addInput(jsonInput);
      const result = await quicktype({
        inputData,
        lang: targetLanguage,
        rendererOptions: {
          'just-types': justTypes,
        },
      });
      return result.lines.join('\n');
    } catch (error) {
      if ((error as Error).message.includes('Unknown language')) {
        throw new Error(
          `Unknown output language '${targetLanguage}'. Please check language support`
        );
      }
      throw error;
    }
  }
}
