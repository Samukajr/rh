# Instruções para Adicionar o Logotipo

## Como adicionar o logotipo da empresa:

1. **Baixe a imagem do logotipo** do Google Drive:
   - Link: https://drive.google.com/file/d/19vRRYnBlZcoY7nkaR1EIU0-gZHTe1shb/view?usp=drive_link

2. **Salve a imagem** no diretório:
   ```
   frontend/public/images/logo.png
   ```

3. **Formatos suportados**: PNG, JPG, SVG
   - **Tamanho recomendado**: 200x200 pixels ou maior
   - **Fundo transparente**: Recomendado (PNG)

4. **O sistema já está configurado** para exibir o logotipo em:
   - Tela de login (80x80 pixels)
   - Header do dashboard (50x50 pixels)
   - Fallback com placeholder "RH" caso a imagem não carregue

## Localização do Logotipo na Interface:

### 🖥️ Tela de Login
- **Posição**: Centro, acima do título "RH Plus"
- **Tamanho**: 80x80 pixels
- **Estilo**: Card com sombra e bordas arredondadas

### 📊 Dashboard
- **Posição**: Header, ao lado do título
- **Tamanho**: 50x50 pixels
- **Estilo**: Compacto, integrado ao design

## ⚠️ Importante:
- Se a imagem não for encontrada, aparecerá um placeholder com as iniciais "RH"
- A imagem será automaticamente redimensionada e centralizada
- O design é responsivo e se adapta a diferentes tamanhos de tela