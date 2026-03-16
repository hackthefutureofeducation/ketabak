import toml; 
f = 'src-tauri/Cargo.toml'
data = toml.load(f)
data['package']['version'] = '$version'
with open(f, 'w') as out: toml.dump(data, out)