use napi::{
  bindgen_prelude::{Error, Uint32Array, Uint8Array},
  Env, JsString,
};
use napi_derive::napi;

#[napi]
pub struct Encoding {
  pub(crate) encoding: tiktoken_rs::CoreBPE,
}

#[napi]
impl Encoding {
  #[napi]
  pub fn encode(&self, text: Uint8Array) -> Uint32Array {
    let text_from_utf8 = std::str::from_utf8(text.as_ref()).unwrap();
    let mut tokens = self.encoding.encode_with_special_tokens(text_from_utf8);

    unsafe {
      return Uint32Array::with_external_data(
        tokens.as_mut_ptr(),
        tokens.len(),
        move |_ptr, _len| drop(tokens),
      );
    }
  }

  #[napi]
  pub fn decode(&self, env: Env, tokens: Uint32Array) -> JsString {
    let decoded_str = self.encoding.decode(tokens.as_ref().to_vec()).unwrap();

    env.create_string_from_std(decoded_str).unwrap()
  }
}

#[napi]
pub fn get_encoding(
  #[napi(
    ts_arg_type = "'gpt2' | 'r50k_base' | 'p50k_base' | 'p50k_edit' | 'cl100k_base' | 'o200k_base'"
  )]
  encoding: String,
) -> Result<Encoding, Error> {
  let encoding: Result<tiktoken_rs::CoreBPE, Error> = match encoding.as_str() {
    "gpt2" => Ok(tiktoken_rs::r50k_base().unwrap()),
    "r50k_base" => Ok(tiktoken_rs::r50k_base().unwrap()),
    "p50k_base" => Ok(tiktoken_rs::p50k_base().unwrap()),
    "p50k_edit" => Ok(tiktoken_rs::p50k_edit().unwrap()),
    "cl100k_base" => Ok(tiktoken_rs::cl100k_base().unwrap()),
    "o200k_base" => Ok(tiktoken_rs::o200k_base().unwrap()),
    _ => Err(Error::from_reason("Invalid encoding")),
  };

  match encoding {
    Ok(encoding) => Ok(Encoding { encoding }),
    Err(err) => Err(err),
  }
}

#[napi]
pub fn encoding_for_model(model_name: String) -> Result<Encoding, Error> {
  let encoding = tiktoken_rs::get_bpe_from_model(&model_name);
  match encoding {
    Ok(encoding) => Ok(Encoding { encoding }),
    Err(err) => Err(Error::from_reason(err.to_string())),
  }
}
